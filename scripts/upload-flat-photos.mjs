import { put, head } from '@vercel/blob';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const files = [
	'araki-on-rug.jpg',
	'living-room.jpg',
	'pink-sofa-and-rug.jpg',
	'yellow-shelves.jpg',
	'wooden-beam-mimosa.jpg',
	'table-protectors.jpg',
];

const contentType = 'image/jpeg';

for (const f of files) {
	const path = resolve('./public/flat/' + f);
	const buf = readFileSync(path);
	const target = 'flat/' + f;

	try {
		const existing = await head(target);
		console.log(`Skip (already exists): ${existing.pathname}`);
		continue;
	} catch {
		// not found, proceed to upload
	}

	const blob = await put(target, buf, {
		access: 'public',
		contentType,
		addRandomSuffix: false,
	});
	console.log(`Uploaded: ${blob.url}`);
}
