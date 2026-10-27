// Cloudflare Pages Function: every request under /api/ is handled here.
import { handleApi } from '../../server/routes.js';

export const onRequest = ({ request, env }) => handleApi(request, env);
