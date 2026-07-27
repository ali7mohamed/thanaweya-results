export const dynamic = 'force-static';

export async function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID; // e.g. "ca-pub-1234567890123456"
  const pubId = client?.replace(/^ca-/, ''); // ads.txt wants "pub-XXXX", not "ca-pub-XXXX"

  const body = pubId
    ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
    : '# NEXT_PUBLIC_ADSENSE_CLIENT_ID is not set — ads.txt is empty until it is.\n';

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
