#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const salasJsonPath = path.join(root, 'public', 'external-site', 'salas.json');
const salasDir = path.join(root, 'public', 'external-site', 'Pagina-Web', 'assets', 'Salas');

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function main() {
  if (!fs.existsSync(salasJsonPath)) {
    console.error('No se encontró', salasJsonPath);
    process.exit(1);
  }
  if (!fs.existsSync(salasDir)) {
    console.error('No se encontró', salasDir);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(salasJsonPath, 'utf8'));
  const files = fs.readdirSync(salasDir).filter(f => fs.statSync(path.join(salasDir, f)).isFile());

  const index = {};
  files.forEach(f => { index[normalizeName(f)] = f; });

  let changed = false;
  data.salas = (data.salas || []).map(entry => {
    const original = entry.img || '';
    const base = path.basename(original);
    const norm = normalizeName(base);
    if (index[norm]) {
      const correct = path.posix.join('assets', 'Salas', index[norm]);
      if (correct !== entry.img) {
        console.log('Actualizar:', entry.img, '->', correct);
        entry.img = correct;
        changed = true;
      }
    } else {
      console.warn('No se encontró coincidencia para', entry.img);
    }
    return entry;
  });

  if (changed) {
    fs.writeFileSync(salasJsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('salas.json actualizado. Haz un deploy o recarga la página.');
  } else {
    console.log('No se realizaron cambios.');
  }
}

main();
