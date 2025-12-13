// https://wikidocs.net/228921
//토큰: https://platform.openai.com/usage


var blankSystem = ""
var grammerSystem = ""
var meaningSystem = ""
var orderSystem = ""

fetch('blank.txt')
  .then((data) => data.text())
  .then((text) => {
    blankSystem = text
    console.log(blankSystem);
  }
);
fetch('grammer.txt')
  .then((data) => data.text())
  .then((text) => {
    grammerSystem = text
    console.log(grammerSystem);
  }
);
fetch('meaning.txt')
  .then((data) => data.text())
  .then((text) => {
    meaningSystem = text
    console.log(meaningSystem);
  }
);
fetch('order.txt')
  .then((data) => data.text())
  .then((text) => {
    orderSystem = text
    console.log(orderSystem);
  }
);


export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { message } = body;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 친절한 도우미입니다." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await openaiRes.json();

  if (!openaiRes.ok || !data.choices || !data.choices[0]) {
    console.error("OpenAI API Error:", data);

    return new Response(
      JSON.stringify({
        error: "OpenAI API error",
        detail: data
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(
    JSON.stringify({
      reply: data.choices[0].message.content
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};