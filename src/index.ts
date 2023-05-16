import render from "render2";

interface Env {
	R2_BUCKET: R2Bucket,
	ALLOWED_ORIGINS?: string,
	CACHE_CONTROL?: string,
	PATH_PREFIX?: string
	INDEX_FILE?: string
	NOTFOUND_FILE?: string
	DIRECTORY_LISTING?: boolean
	HIDE_HIDDEN_FILES?: boolean
	DIRECTORY_CACHE_CONTROL?: string

	// put extra buckets here
	PUB_BUCKET: R2Bucket
	UP_BUCKET: R2Bucket
	CDN_BUCKET: R2Bucket
	TERMUX_BUCKET: R2Bucket
	OBS_BUCKET: R2Bucket
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// for each, R2_BUCKET is required
		const config: { [id: string]: RenderEnv; } = {
			"cdn.erisa.cloud": {
				R2_BUCKET: env.PUB_BUCKET,
				DIRECTORY_LISTING: true
			},
			"up.erisa.uk.lewd.tech": {
				R2_BUCKET: env.UP_BUCKET
			},
			"cdn.erisa.uk.lewd.tech": {
				R2_BUCKET: env.CDN_BUCKET
			},
			"termux.lewd.tech": {
				R2_BUCKET: env.TERMUX_BUCKET,
				DIRECTORY_LISTING: true
			},
			"obs.lewd.tech": {
				R2_BUCKET: env.OBS_BUCKET,
				DIRECTORY_LISTING: true
			},
			"multi-render.erisa.workers.dev": {
				R2_BUCKET: env.R2_BUCKET,
				DIRECTORY_LISTING: true
			}
		}

		const url = new URL(request.url)
		const domain = url.hostname

		if (config[domain]) {
			// merge, overwriting with new config
			if (config[domain].R2_BUCKET) {
				env = { ...env, ...config[domain] }
			}
		}

		// fall throughh to render
		return render.fetch(request, env, ctx);
	},
};

// TODO: work out how to import this from render

interface RenderEnv {
	R2_BUCKET: R2Bucket,
	ALLOWED_ORIGINS?: string,
	CACHE_CONTROL?: string,
	PATH_PREFIX?: string
	INDEX_FILE?: string
	NOTFOUND_FILE?: string
	DIRECTORY_LISTING?: boolean
	HIDE_HIDDEN_FILES?: boolean
	DIRECTORY_CACHE_CONTROL?: string
}