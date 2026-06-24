export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    // Upload to R2 Bucket using binding
    await env.BUCKET.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // Get public URL from env or fallback
    const publicUrl = env.R2_PUBLIC_URL || "https://your-r2-public-url.r2.dev";
    const fileUrl = `${publicUrl}/${filename}`;
    
    return Response.json({ url: fileUrl });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
