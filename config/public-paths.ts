interface PublicPath {
  get: string[];
  patch: string[];
  post: string[];
  delete: string[];
}

const publicPath: PublicPath = {
  get: [],
  patch: [],
  post: ['api/login', 'api/register'],
  delete: []
};

type HttpMethod = keyof PublicPath;

export default function publicPaths(method: HttpMethod) {
  const prefix = '^/';
  const pathRegexStr = prefix + publicPath[method].map((path: string) => {
    return `(?!${path})`;
  }).join('') + '.*';
  return new RegExp(pathRegexStr, 'i');
}

