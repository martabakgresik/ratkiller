export async function onRequestGet(context: any) {
  try {
    const { env, params } = context;
    const filename = params.filename;

    if (!filename) {
      return new Response("Not found", { status: 404 });
    }

    const object = await env.BUCKET.get(filename);

    if (object === null) {
      return new Response("Object Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(object.body, {
      headers,
    });
  } catch (e) {
    return new Response("Error fetching file", { status: 500 });
  }
}
