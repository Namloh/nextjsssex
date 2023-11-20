interface PageProps {
    params: {
        pagename: string
    }
}

export default function Page({ params }: PageProps){
    return(
        <div>
            <h1>{params.pagename}</h1>
        </div>
    )
}