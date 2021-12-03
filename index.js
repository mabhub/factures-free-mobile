#!/usr/bin/env node

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs/promises';
import readlineSync from 'readline-sync';


const freeId = process.env.FREEMOBILE_ID || readlineSync.question(`Identifiant ? `);
const pwd = process.env.FREEMOBILE_PWD || readlineSync.question(`Mot de passe (${freeId}) ? `, { hideEchoBack: true });

if (!pwd || !freeId) {
  process.exit();
}

const rawHome = await fetch('https://mobile.free.fr/account/');
const homeHeaders = Object.fromEntries(rawHome.headers.entries());
const session = homeHeaders['set-cookie'].split(';')[0];

const rawAuth = await fetch(
  'https://mobile.free.fr/account/',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': session,
    },
    body: `login-ident=${freeId}&login-pwd=${encodeURIComponent(pwd)}&bt-login=1`,
  },
);

const html = await rawAuth.text();

const { document } = new JSDOM(html, {
  url: "https://mobile.free.fr/account/",
  contentType: "text/html",
}).window;

const dates = Array.from(document.querySelectorAll('div.date'));
const links = dates
  .map(date => date.parentElement.querySelector('a[href].i-pdf')?.href)
  .filter(Boolean)
  .filter(link => !link.includes('pdfrecap'));

for await (const link of links) {
  const raw = await fetch( link, { headers: { 'Cookie': session }, method: 'HEAD' } );
  const headers = Object.fromEntries(raw.headers.entries());
  const { 1: filename } = headers['content-disposition'].match(/"(.*)"/);

  let exists;
  try {
    exists = await fs.stat(filename);
  } catch (err) {
    console.log(`Will download: ${filename}`);
  }

  if (!exists) {
    const raw = await fetch( link, { headers: { 'Cookie': session } } );
    const buff = await raw.arrayBuffer();
    await fs.writeFile(filename, Buffer.from(buff));
  } else {
    console.log(`Already have: ${filename}`);
  }

  console.log('Wait 1 sec before next download');
  await new Promise(res => setTimeout(res, 1000));
}
