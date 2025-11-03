#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage() {
  console.log('Usage: node tools/update-salas.js add --img <path> --texto "Texto" [--id <num>]');
  console.log('       node tools/update-salas.js list');
  console.log('       node tools/update-salas.js remove --id <num>');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--img') { args.img = argv[++i]; }
    else if (a === '--texto') { args.texto = argv[++i]; }
    else if (a === '--id') { args.id = parseInt(argv[++i], 10); }
    else if (!args._cmd) args._cmd = a;
  }
  return args;
}

const root = process.cwd();
const salasJsonPath = path.join(root, 'public', 'external-site', 'salas.json');
const destinoImgs = path.join(root, 'public', 'external-site', 'Pagina-Web', 'assets', 'Salas');

async function main() {
  const argv = process.argv.slice(2);
  if (!argv.length) return usage();
  const cmd = argv[0];
  const args = parseArgs(argv.slice(1));

  if (cmd === 'list') {
    const data = JSON.parse(fs.readFileSync(salasJsonPath, 'utf8'));
    console.log(data.salas);
    return;
  }

  if (cmd === 'remove') {
    if (!args.id) return usage();
    const data = JSON.parse(fs.readFileSync(salasJsonPath, 'utf8'));
    data.salas = data.salas.filter(s => s.id !== args.id);
    fs.writeFileSync(salasJsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Removido id=', args.id);
    return;
  }

  if (cmd === 'add') {
    if (!args.img || !args.texto) return usage();
    if (!fs.existsSync(args.img)) { console.error('Archivo de imagen no encontrado:', args.img); process.exit(1); }
    if (!fs.existsSync(destinoImgs)) fs.mkdirSync(destinoImgs, { recursive: true });

    const origen = args.img;
    const baseName = path.basename(origen);
    const uniqueName = `${Date.now()}-${baseName}`;
    const destPath = path.join(destinoImgs, uniqueName);
    fs.copyFileSync(origen, destPath);

    const relPathForJson = path.posix.join('assets', 'Salas', uniqueName);

    const data = JSON.parse(fs.readFileSync(salasJsonPath, 'utf8'));
    const newId = args.id || ((data.salas.reduce((m, s) => Math.max(m, s.id || 0), 0) || 0) + 1);
    data.salas.push({ img: relPathForJson, texto: args.texto, id: newId });
    fs.writeFileSync(salasJsonPath, JSON.stringify(data, null, 2), 'utf8');

    console.log('Imagen copiada a:', destPath);
    console.log('salas.json actualizado con id:', newId);
    return;
  }

  usage();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
