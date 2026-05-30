export async function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  if (!client) {
    return new Response('', { status: 200 })
  }

  // "ca-pub-XXXX" 에서 "pub-XXXX" 부분 추출
  const pubId = client.startsWith('ca-') ? client.slice(3) : client

  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
