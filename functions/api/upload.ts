import { extractToken, verifyToken } from '../utils/jwt';

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    
    // Auth check
    const token = extractToken(request);
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing token" }), { status: 401, headers: { "Content-Type": "application/json" }});
    }
    
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), { status: 401, headers: { "Content-Type": "application/json" }});
    }

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

    // Return the local API path to serve the file directly
    const fileUrl = `/api/media/${filename}`;
    
    return Response.json({ url: fileUrl });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
