import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { site } from '../src/config/site.mjs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const robots = readFileSync(new URL('../dist/robots.txt', import.meta.url), 'utf8');
assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'Debe existir un único H1');
assert.match(html, /lang="es-MX"/);
assert.match(html, /Diseño de páginas web en Tuxtla Gutiérrez/);
assert.match(html, /name="description" content="[^"]{70,180}"/);
assert.ok(html.includes(`rel="canonical" href="${site.url}/"`));
assert.ok(html.includes(`wa.me/${site.whatsapp}`));
assert.ok(html.includes(`mailto:${site.email}`));
assert.ok(html.includes('quote-form') && html.includes('quote-preview'));
if (site.publicLaunch) {
 assert.match(html, /name="robots" content="index, follow/);
 assert.ok(!robots.includes('Disallow: /'));
 assert.ok(robots.includes(`${site.url}/sitemap-index.xml`));
}
for (const id of ['contenido', 'servicios', 'proceso', 'preguntas', 'contacto']) assert.ok(html.includes(`id="${id}"`));
const schemaText = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
assert.ok(schemaText, 'Faltan datos estructurados');
const schema = JSON.parse(schemaText);
assert.equal(schema.address.addressLocality, 'Tuxtla Gutiérrez');
assert.equal(schema.telephone, site.phone);
assert.equal(schema.url, site.url);
for (const asset of [...html.matchAll(/(?:src|href)="(\/_astro\/[^"?#]+)"/g)]) {
 assert.ok(existsSync(new URL(`../dist${asset[1]}`, import.meta.url)), `Falta asset ${asset[1]}`);
}
for (const file of ['sitemap-index.xml', 'sitemap-0.xml', 'privacidad/index.html', '404.html', 'favicon.svg']) assert.ok(existsSync(new URL(`../dist/${file}`, import.meta.url)), `Falta ${file}`);
console.log('Correcto: SEO local, canonical, indexación, sitemap, datos de contacto, formulario y assets.');
