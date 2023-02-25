import {generateSecret} from 'speakeasy'

export function _2fa() {
	const secret = generateSecret({
		name: 'lol'
	})	

	console.log(secret)

	return (
		<div>lol</div>
	)


}