import { createServer } from 'node:http'
import fetch from 'node-fetch'

function error(res, status, message) {
	res.writeHead(status)
	res.write(message)
	res.end()
	return
}

createServer(async (req, res) => {
	try {
		const url = req.url?.slice(1)
		const method = req.method || 'GET'

		const headers = req.headers
		delete headers.host

		if (!url) return error(res, 403, 'No url was provided')
		try {
			new URL(url)
		} catch {
			return error(res, 403, 'Invalid url was provided')
		}

		const fetched = await fetch(url, { method, headers, body: method === 'GET' ? null : req })
		res.writeHead(fetched.status, fetched.headers.raw())
		fetched.body.pipe(res)
	} catch (e) {
		console.log(e)
		return error(res, 500, 'Some errors have occured')
	}
}).listen(3000)
