import { put, head } from '@vercel/blob';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DOWNLOADS = '/Users/lmangall/Downloads';

const files = [
	{
		src: '3D Pine Processionary Image May 17 2026.png',
		dest: 'processionary/3d.png',
		contentType: 'image/png',
	},
	{
		src: 'Chenille Processionnaires Chien.jpg',
		dest: 'processionary/dog.jpg',
		contentType: 'image/jpeg',
	},
	{
		src: 'Allergic Caterpillar Symptoms.png',
		dest: 'processionary/symptoms.png',
		contentType: 'image/png',
	},
	{
		src: 'Chenille Processionnaires Nymphose.jpg',
		dest: 'processionary/nymphose.jpg',
		contentType: 'image/jpeg',
	},
	{
		src: 'Chenilles 1024x768.jpg',
		dest: 'processionary/caterpillars.jpg',
		contentType: 'image/jpeg',
	},
	{
		src: 'Processionary Caterpillar Trap.jpg',
		dest: 'processionary/trap.jpg',
		contentType: 'image/jpeg',
	},
];

for (const f of files) {
	const path = resolve(DOWNLOADS, f.src);
	const buf = readFileSync(path);

	try {
		const existing = await head(f.dest);
		console.log(`Skip (exists): ${existing.pathname}`);
		continue;
	} catch {
		// not found, proceed
	}

	const blob = await put(f.dest, buf, {
		access: 'public',
		contentType: f.contentType,
		addRandomSuffix: false,
	});
	console.log(`Uploaded: ${blob.url}`);
}
