import path from 'node:path';
import fs from 'node:fs/promises';
import config from './config.js';

const {
	checkInterval,
	timeoutLength,
	urlToFetch,
	outFilename
} = config;

const outPath = path.join('.', outFilename);

// This utility only appends to the file, never replaces it
console.log(`Writing to ${outPath}`);

let successCount = 0;
let failureCount = 0;

while(true) {

	let res;
	let error;
	let t0;
	let t1;
	
	try {
		t0 = Date.now();
		res = await attemptFetch(urlToFetch, timeoutLength);
	} catch(e) {
		error = e;
	} finally {
		t1 = Date.now();
		let elapsed = t1 - t0;
		let outcome;
		let message;

		let dateNow = new Date();
		
		if(res) {
			// it is success as long as we get any sort of response from the external server, i.e. fetch doesn't fail due to network issues
			// we don't care about the response codes though - we might be getting 404 but we don't care as long as we get something
			successCount++;
			message = `Server responded ☺  (x ${successCount})`;

			outcome = 'success';
			console.log(message);
		} else if(error) {
			failureCount++;

			let reason = error.message;
			let cause = error['cause'];
			
			if(cause) {
				reason += ` (${cause.message})`;
			}

			message = `Failure (x ${failureCount}): ${reason}`;

			outcome = 'error: ' + reason;
			console.error(message);
		}

		let outStr = [dateNow.toString(), elapsed, outcome].join(',');

		await addToOutputFile(outPath, outStr);
	}

	await waitTime(checkInterval);
}


async function attemptFetch(url, timeoutLength) {
	return new Promise(async (resolve, reject) => {

		let timeoutTimeout = setTimeout(() => {
			reject(new Error(`Timed out after ${timeoutLength}`));
		}, timeoutLength);

		try {
			let resp = await fetchURL(url);
			// console.log("got a response", resp);
			resolve(resp);
		} catch(e) {
			reject(e);
		} finally {
			clearTimeout(timeoutTimeout);
		}

	});
}

async function fetchURL(url) {
	let resp = await fetch(url, {
		cache: 'no-store',
		method: 'HEAD'
	});
	return resp;
}

async function addToOutputFile(filePath, str) {
	const fd = await fs.open(filePath, 'a');
	await fd.write(str + '\n', null, 'utf-8');
	await fd.close();
}

async function waitTime(interval) {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, interval);
	});
}
