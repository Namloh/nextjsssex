"use client";
// pages/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Quote from '../app/models/Quote';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import Navbar from './Navbar';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {
  let emptyQuote : Quote = {
    id: null,
    text: '',
    createdAt: null
  };
  const [quotes, setquotes] = useState<Quote[]>([]);
  const [quoteDialog, setquoteDialog] = useState<boolean>(false);
  const [deletequoteDialog, setDeletequoteDialog] = useState<boolean>(false);
  const [quote, setquote] = useState<Quote>(emptyQuote);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const dt = useRef<DataTable<Quote[]>>(null);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        setquotes(data)
        setLoading(false);
        if (data.message) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }
      });
  }, []);

  const confirmDeletequote = (quote: Quote) => {
    setquote(quote);
    setDeletequoteDialog(true);
  };

  const deletequote = () => {
    setLoading(true)
    var status = 200
    fetch(`/api/quotes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: quote.id})
    })
      .then((response) => {
        status = response.status
        return response.json()
      })
      .then((deletedquote) => {
        setquotes(quotes.filter((quote) => quote.id !== deletedquote.id));
        fetch('/api/quotes')
          .then((response) => {
            status = response.status
            return response.json()
          })
          .then((data) => {
            setquotes(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDeletequoteDialog()
        if (status != 200) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: deletedquote.message, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: deletedquote.message, life: 3000 });
        }
      });
  };

  const hideDeletequoteDialog = () => {
    setDeletequoteDialog(false);
  };

  
  const actionBodyTemplate = (rowData: Quote) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeletequote(rowData)} />
        </React.Fragment>
    );
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _quote = { ...quote };

    // @ts-ignore
    _quote[`${name}`] = val;

    setquote(_quote);
  };

  const deletequoteDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeletequoteDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deletequote} />
    </React.Fragment>
  );

  const openNew = () => {
    setquote(emptyQuote);
    setSubmitted(false);
    setquoteDialog(true);
  };

  const savequote = () => {
    setSubmitted(true);
    setLoading(true)

    fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: quote.text, createdAt: quote.createdAt }),
    })
      .then((response) => response.json())
      .then((createdquote) => {
        setquotes([...quotes, createdquote]);
        setquote({ id: '', text: '', createdAt: null });
        fetch('/api/quotes')
          .then((response) => response.json())
          .then((data) => {
            setquotes(data)
            setLoading(false);
            if (data.message) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          });
        hideDialog()
        if (createdquote.id) {
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'quote Created: ' + createdquote.id, life: 3000 });
        }
        else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: createdquote.message, life: 3000 });
        }
      });
  };

  const hideDialog = () => {
    setSubmitted(false);
    setquoteDialog(false);
  };

  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        </div>
    );
  };

  const quoteDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={savequote} />
    </React.Fragment>
  );

  return (
    <>
      <Navbar />
      <div className="m-3">
        <div className="row">
          <div className="flex-auto w-full">
            <h1>quotes</h1>
            <Toast ref={toast} />
            <div className="card">
              {loading ? (
                <div className="flex justify-content-center flex-wrap">
                  <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
              ) : (
                <div>
                  <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  <DataTable ref={dt} value={quotes}
                          dataKey="id"  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} quotes">
                      <Column field="serial_number" header="Serial Number" sortable></Column>
                      <Column field="product_id" header="Product ID" sortable></Column>
                      <Column field="createdAt" header="Created" sortable></Column>
                      <Column body={actionBodyTemplate} exportable={false}></Column>
                  </DataTable>
                </div>
              )}
            </div>
            <Dialog visible={quoteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="quote Details" modal className="p-fluid" footer={quoteDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="serial_number" className="font-bold">
                        Quote Text
                    </label>
                    <InputTextarea id="serial_number" value={quote.text} onChange={(e) => onInputChange(e, 'text')} required autoFocus className={classNames({ 'p-invalid': submitted && !quote.text })} />
                  
                    {submitted && !quote.text && <small className="p-error">Serial Number is required.</small>}
                </div>           
            </Dialog>
            <Dialog visible={deletequoteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletequoteDialogFooter} onHide={hideDeletequoteDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {quote && (
                        <span>
                            Are you sure you want to delete <b>{quote.text}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}