# Blog Simples Utilizando Next.js e Prismic CMS

Uma aplicação para treinar os conhecimentos de Next.js, sobretudo a utilização do `GetStaticProps` e `GetServerSideProps`.

O blog foi criado do zero, conforme o layout do Figma disponibilizado [neste link](https://www.figma.com/file/lY1Q6pQqjo439UQlvJACg2/Desafios-M%C3%B3dulo-3-ReactJS?node-id=0%3A1). Os dados consumidos (posts) foram extraídos de um respositório criado no Prismic. Para a criação do projeto, foram utilizados(as) os seguites recursos:

- Estilizações global, comum e individuais (utilizando o CSS modules do Next.js);
- Importação de fontes Google;
- Paginação de posts;
- Cálculo de tempo estimado de leitura do post;
- Geração de páginas estáticas com os métodos `getStaticProps` e `getStaticPaths`;
- Formatação de datas com `date-fns`;
- Uso de ícones com `react-icons`;
- Requisições HTTP com `fetch`;
- Dentre outros.

# Preview do Funcionamento da Aplicação

![Preview da Aplicação](public/preview.gif)