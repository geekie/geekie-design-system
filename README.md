# Geekie Design System

Nesse repositório estão escritos, e documentados, as definições do nosso design system e design tokens.

## Nossos objetivos

> 🎯 Encaminhar o desenvolvimento de um Design System que promova uma experiência mais padronizada, simples e acessível em todos os segmentos da educação e em diferentes dispositivos, acelerando a evolução da Geekie.

> 🎯 Simplificar o processo de design e engenharia, com comunicação fluída e facilidade na construção de produtos acessíveis, reduzindo o tempo de desenvolvimento, permitindo escalabilidade e experimentação de novas formas de organização.

## Antes de começar

Vale definir as resposabilidades das ferramentas em cada um dos processos.
Atualmente usamos:

- [style-dictionary](https://github.com/amzn/style-dictionary) para escrever e construir nossos design tokens
- [storybook](https://storybook.js.org/) como ambiente de desenvolvimento e para documentar tokens e componentes

## Como rodar

Primeiro, garanta que os tokens foram gerados corretamente, rodando o script: `yarn build-tokens` - _Você pode conferir os tokens gerados na pasta `/build`_.

Depois, para inicializar o storybook, rode o script: `yarn storybook`.

<br />

# Tokens

Usamos o [style-dictionary](https://github.com/amzn/style-dictionary) para escrever e construir nossos design tokens.
Eles são escritos na pasta `/tokens`, em arquivos `.json`, seguindo o padrão esperado pela ferramenta.

## Como escrever um token

Crie, ou altere, o arquivo `.json` na pasta `/tokens`, adequando o formato:

`$ELEMENT_CATEGORY_VARIANT_STATE_PROPERTY`

Ou, em `JSON`:

```json
"element": {
    "category": {
        "variant": {
            "state": {
                "property": {
                    "value": "VALOR"
                }
            }
        }
    }
}
```

### Exemplo

Para criar o token de cor: `$COLOR_BRAND_CEREJA`, de valor `#F03246`, criaremos, na pasta `/tokens`, um arquivo `color.json` no formato:

```json
"color": {
    "brand": {
        "cereja": {
            "value": "#F03246"
        }
    }
}
```

Note que nesse exemplo não usamos todas as subdivisões do formato descrito acima.

## Como construir o token para distribuição

A **resposta rápida** é: rode o script

`yarn build-tokens`

E os tokens serão construídos na pasta `/build`.

Usamos um script customizado, para garantir que exportamos um arquivo correto para documentar os tokens no storybook. Detalharemos esse assunto um pouco mais à frente.

### Construção de tokens com o style dictionary e o script customizado

Os arquivos envolvidos nesse processo são:

`style-dictionary-build.js` - Para simplificar, vamos chamar esse arquivo de **script de build**
e
`style-dictionary-config.json` - Que vamos chamar de **arquivo de configuração**.

No _arquivo de configuração_, estão definidas as [plataformas](https://amzn.github.io/style-dictionary/#/architecture?id=_4-iterate-over-the-platforms) e os [transform-groups](https://amzn.github.io/style-dictionary/#/transform_groups) - que definem os tipos de arquivos de saída.

As platforms são definidas no formato:

```json
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_variables.scss",
          "format": "scss/variables"
        },
      ]
    }
  }
```

Já no _script de build_ temos definidos um [custom-transform](https://amzn.github.io/style-dictionary/#/transforms?id=defining-custom-transforms) - para garantir o formato que precisamos na documentação dos tokens no storybook.

## Como documentar os tokens no storybook

Como já comentado anteriormente, criamos um processo um pouco mais automatizado para criar os tokens e documentá-los no storybook.

Nesse processo, usamos um addon para o storybook - [storybook-design-token](https://github.com/UX-and-I/storybook-design-token) - que consegue documentar e gerar previews dos tokens.
Esse addon precisa de um arquivo, em um formato específico, chamado de [presenters](https://github.com/UX-and-I/storybook-design-token/tree/v3#available-presenters) pelo addon, que é criado na construição dos tokens - através do style-dictionary - encontrado na pasta `/build/scss/_variables_with_headers.scss`. Esse formato é definido no _script de build_, em `DESIGN_TOKEN_CATEGORIES_BY_PREFIX`.

Então, para **documentar um token**, após terminar o processo descrito anteriormente, vale conferir se o _script de build_ já tem a categoria necessária - se não, criá-la de acordo com os [presenters](https://github.com/UX-and-I/storybook-design-token/tree/v3#available-presenters) suportados pelo addon.

Os presentes, no _script de build_, são escritos no formato:

```javascript
const DESIGN_TOKEN_CATEGORIES_BY_PREFIX = {
...
  DSA_FONT_FAMILY: { categoryName: "Font families", presenterName: "FontFamily" },
...
};
```

Depois, é preciso criar um [story](https://storybook.js.org/docs/web-components/get-started/whats-a-story) para exibir a documentação no storybook. Os stories, atualmente, são criados na pasta `/stories`, e escritos no formato `storyName.stories.mdx`.

Por fim, no arquivo, definimos os blocos de documentação, de acordo com as categorias que descrevemos no _script de build_:

O arquivo fica no formato:

```javascript
import { Meta, Story, Canvas } from '@storybook/addon-docs';
import { DesignTokenDocBlock } from 'storybook-design-token';

<Meta title="Design Tokens/Tipografia" />

# Tipografia

## Font family

<DesignTokenDocBlock categoryName="Font families" showSearch={false} />
```

Verifique se o token foi documentado rodando o script e inicalização do storybook: `yarn storybook`.

### Para documentar um token que não tem presenter suportado no addon

Criamos um componente que replica o funcionamento e visualização do `DesignTokenDocBlock`, que é chamado `CustomDesignTokenDocBlock`. Então, verifique os presenters suportados pelo nosso componente - para garantir que o estilo esperado já esteja implementado.

**Para documentar:**

Importe e use o componente do bloco de documentação customizado, seguindo o exeplo:

```javascript
import { Meta, Story, Canvas } from '@storybook/addon-docs';
import CustomDesignTokenDocBlock from '../utils/CustomDesignTokenDocBlock';

import typograpyTokens from "../tokens/typography.json";

<Meta title="Design Tokens/Tipografia" />

# Tipografia

## Font style

<CustomDesignTokenDocBlock
    blockType="table"
    previewType="text"
    presenter="font-style"
    tokens={[
      {
        name: "$DSA_FONT_STYLE_ITALIC",
        value: typograpyTokens.font.style.italic.value,
      }
    ]}
/>
```
**Lembre-se, também, de importar o json dos tokens referenciados**

Se precisar, extenda o suporte desse bloco para adicionar novos presenters e seus respectivos estilos. O componente está em: `/utils/CustomDesignTokenDocBlock`.
