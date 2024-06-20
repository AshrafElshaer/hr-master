import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { createServerClient } from "@hr-toolkit/supabase/server";

export async function GET(req: Request, res: Response) {
  const supabase = createServerClient();
  const requestUrl = new URL(req.url);
  const path = requestUrl.searchParams.get("path");
  const filename = requestUrl.searchParams.get("filename");
  const employeeId = requestUrl.searchParams.get("employeeId");
  const organizationId = requestUrl.searchParams.get("organizationId");

  if (!path || !filename || !employeeId) {
    return new Response("Missing required parameters", {
      status: 400,
    });
  }

  const filePath = `${organizationId}/${employeeId}/${path}/${filename}`;

  const { data } = await supabase.storage
    .from("employee-documents")
    .download(filePath);

  const responseHeaders = new Headers(res.headers);

  responseHeaders.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );

  return new Response(data, {
    headers: responseHeaders,
  });
}
