/**
 * Simple MD5 implementation in TypeScript
 */
export function md5(string: string) {
    function k(n: number) {
        return Math.abs(Math.sin(n)) * 4294967296 | 0;
    }

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    const words: number[] = [];
    for (let i = 0; i < string.length; i++) {
        words[i >> 2] |= (string.charCodeAt(i) & 255) << ((i % 4) * 8);
    }
    const n = string.length;
    words[n >> 2] |= 128 << ((n % 4) * 8);
    words[((n + 8) >> 6 << 4) + 14] = n * 8;

    for (let i = 0; i < words.length; i += 16) {
        for (let j = 0; j < 64; j++) {
            let f, g;
            if (j < 16) {
                f = (b & c) | (~b & d);
                g = j;
            } else if (j < 32) {
                f = (d & b) | (~d & c);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                f = b ^ c ^ d;
                g = (3 * j + 5) % 16;
            } else {
                f = c ^ (b | ~d);
                g = (7 * j) % 16;
            }
            const temp = d;
            d = c;
            c = b;
            b = (b + Math.round((a + f + k(j + 1) + (words[i + g] || 0)) << 0)) | 0;
            a = temp;
        }
    }

    return string.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0).toString(16);
}

export function getGravatarUrl(email: string, size = 200) {
    const cleanEmail = (email || '').trim();
    const initial = cleanEmail ? cleanEmail.charAt(0).toUpperCase() : 'U';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00a294" />
          <stop offset="100%" stop-color="#003B73" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#brandGradient)" />
      <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="${Math.round(size * 0.45)}" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initial}</text>
    </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function simpleMd5(s: string) {
    let hash = 0;
    if (s.length === 0) return '00000000000000000000000000000000';
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
}
