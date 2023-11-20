"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "../comps/button";

export default function Home() {
  const [pageName, setPageName] = useState<string>("")
  const router = useRouter()
  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault()
    const email = event.currentTarget.email.value

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email
      })
    }).then((data) => {
      alert(data.status)
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input placeholder="email" type="email" name="email"></input>
        <button type="submit">sendemal</button>
      </form>
    </div>
  )
}
