import prisma from "../../../lib/prismaHelper";

export async function GET(req: Request, res: Response) {
  try {
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        text: true,
        createdAt: true
      },
    });
    return new Response(JSON.stringify(quotes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()

    if (!body.text) {
      return new Response(
        JSON.stringify({
          message: "Serial Number and Product ID must be filled",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = await prisma.quote.create({
      data: {
          text: body.text,
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json()
    const quote = await prisma.quote.delete({
      where: { id: body.id}
    });
    return new Response(
      JSON.stringify({
        message: "quote deleted: " + body.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  catch {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}