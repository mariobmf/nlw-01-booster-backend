import * as Knex from 'knex';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex: Knex): Promise<any> {
  return knex('items').insert([
    { title: 'Lâmpadas', image: 'lampadas.svg' },
    { title: 'Pilhas e Baterias', image: 'baterias.svg' },
    { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' },
    { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
    { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
    { title: 'Ôleo de Cozinha', image: 'oleo.svg' },
  ]);
}
