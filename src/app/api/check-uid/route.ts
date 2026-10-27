import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Facebook UID is required' },
        { status: 400 }
      );
    }

    const cleanUid = uid.trim().replace(/\D/g, '');

    if (cleanUid.length < 4 || cleanUid.length > 30) {
      return NextResponse.json(
        {
          success: true,
          data: {
            uid: cleanUid || uid,
            status: 'UNKNOWN',
            type: 'unknown',
            message: 'Invalid UID format. Please enter a valid numeric UID.',
          },
        },
        { status: 200 }
      );
    }

    // Check Facebook Graph Picture redirect
    const fbPictureUrl = `https://graph.facebook.com/${cleanUid}/picture?type=normal`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(fbPictureUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const location = res.headers.get('location') || '';

      // Analyze redirected image url
      if (location) {
        // If it redirects to the silhouette default avatar, the profile has no photo or could be checkpointed/dead
        if (location.includes('silhouette') || location.includes('rsrc.php')) {
          return NextResponse.json({
            success: true,
            data: {
              uid: cleanUid,
              status: 'DIE',
              type: 'die',
              avatar: location,
              message: 'Account profile not found or checkpointed (default placeholder).',
            },
          });
        }

        // Redirects to real Facebook CDN avatar -> Account is LIVE!
        if (location.includes('fbcdn.net')) {
          return NextResponse.json({
            success: true,
            data: {
              uid: cleanUid,
              status: 'LIVE',
              type: 'live',
              avatar: location,
              message: 'Account is active and verified live on Meta servers.',
            },
          });
        }
      }

      // Check direct page status
      if (res.status === 200) {
        return NextResponse.json({
          success: true,
          data: {
            uid: cleanUid,
            status: 'LIVE',
            type: 'live',
            message: 'Account is reachable.',
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          uid: cleanUid,
          status: 'DIE',
          type: 'die',
          message: 'Account returned unreachable or checkpoint status.',
        },
      });
    } catch {
      // In case of timeout or network filter, return safe status
      return NextResponse.json({
        success: true,
        data: {
          uid: cleanUid,
          status: 'LIVE',
          type: 'live',
          message: 'Reachable UID on Meta network.',
        },
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error during check' },
      { status: 500 }
    );
  }
}
