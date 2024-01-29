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

Primeiro, garanta que os tokens foram gerados corretamente, rodando o script: `yarn build-tokens` - _Você pode conferir os tokens gerados na pasta `/built-tokens`_.

Depois, para inicializar o storybook, rode o script: `yarn storybook`.

## Processo de revisão

O processo de revisão de código é feito por PRs do GitHub. É possível abrir um PR rodando por exemplo `gh pr create`. É uma boa prática rodar localmente o lint com o comando `make lint` antes de enviar o código para revisão, mas as verificações de lint acontecerão também no CI do GitHub de todo modo.

## Deploy

O fluxo de deploy é feito no [Chromatic](https://www.chromatic.com). Para deployar, é preciso ter a variável de ambiente `CHROMATIC_PROJECT_TOKEN` definida. O valor do token pode ser encontrado na [página de configurações do projeto no Chromatic](https://www.chromatic.com/manage?appId=64c2ae277bc565bc4c2176de&view=configure) (faça login com a conta do GitHub).

O deploy em si é feito com o comando:

```
yarn chromatic
```

Após a execução, a build vai estar disponível numa URL específica fornecida no output do comando acima, e também em `https://<branch>--64c2ae277bc565bc4c2176de.chromatic.com`. Dessa forma, para fazer um deploy em produção é preciso estar na branch `master`, e a build resultante estará disponível em https://master--64c2ae277bc565bc4c2176de.chromatic.com.

# Tokens

Usamos o [style-dictionary](https://github.com/amzn/style-dictionary) para escrever e construir nossos design tokens.
Eles são escritos na pasta `/tokens/src`, em arquivos `.json`, seguindo o padrão esperado pela ferramenta.

## Como escrever um token

Crie, ou altere, o arquivo `.json` na pasta `/tokens/src`, adequando o formato:

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

Para criar o token de cor: `$COLOR_BRAND_CEREJA`, de valor `#F03246`, criaremos, na pasta `/tokens/src`, um arquivo `color.json` no formato:

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

E os tokens serão construídos na pasta `/built-tokens`.

Usamos um script customizado, para garantir que exportamos um arquivo correto para documentar os tokens no storybook. Detalharemos esse assunto um pouco mais à frente.

### Construção de tokens com o style dictionary e o script customizado

Os arquivos envolvidos nesse processo são:

`/tokens/config/style-dictionary-build.js` - Para simplificar, vamos chamar esse arquivo de **script de build**
e
`/tokens/config/style-dictionary-config.json` - Que vamos chamar de **arquivo de configuração**.

No _arquivo de configuração_, estão definidas as [plataformas](https://amzn.github.io/style-dictionary/#/architecture?id=_4-iterate-over-the-platforms) e os [transform-groups](https://amzn.github.io/style-dictionary/#/transform_groups) - que definem os tipos de arquivos de saída.

As platforms são definidas no formato:

```json
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "built-tokens/scss/",
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
Esse addon precisa de um arquivo, em um formato específico, chamado de [presenters](https://github.com/UX-and-I/storybook-design-token/tree/v3#available-presenters) pelo addon, que é criado na construição dos tokens - através do style-dictionary - encontrado na pasta `/built-tokens/scss/_variables_with_headers.scss`. Esse formato é definido no _script de build_, em `DESIGN_TOKEN_CATEGORIES_BY_PREFIX`.

Então, para **documentar um token**, após terminar o processo descrito anteriormente, vale conferir se o _script de build_ já tem a categoria necessária - se não, criá-la de acordo com os [presenters](https://github.com/UX-and-I/storybook-design-token/tree/v3#available-presenters) suportados pelo addon.

Os presentes, no _script de build_, são escritos no formato:

```javascript
const DESIGN_TOKEN_CATEGORIES_BY_PREFIX = {
...
  DSA_FONT_FAMILY: { categoryName: "Font families", presenterName: "FontFamily" },
...
};
```

Depois, é preciso criar um [story](https://storybook.js.org/docs/web-components/get-started/whats-a-story) para exibir a documentação no storybook. Os stories de tokens, atualmente, são criados na pasta `/stories/tokens`, e escritos no formato `storyName.stories.mdx`.

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
import CustomDesignTokenDocBlock from '../../utils/CustomDesignTokenDocBlock';

import typograpyTokens from "../../tokens/src/typography.json";

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

## Uso como biblioteca externa

Escrevemos um guia de uso, que pode ser encontrado ao rodar o storybook, ou no acessando esse [link](https://master--64c2ae277bc565bc4c2176de.chromatic.com/?path=/docs/documentação-guias-tokens-e-presets--docs).

# Modo escuro e tokens semânticos

Recomendo começar pelos materiais:

- Jenga | [Como o design system pode apoiar a implementação de um modo escuro](https://www.notion.so/geekie/Como-o-design-system-pode-apoiar-a-implementa-o-de-um-modo-escuro-54e44c4b27dd427aa9012c517b1e780e)
- Spike | [Dark mode com DS](https://www.notion.so/geekie/Spike-Dark-Mode-com-DS-b8f589e7939e4692a4b264e2ecb95738)

Atualmente, temos no DS três pontos para a implementação de um modo escuro:

## 1. Os tokens semânticos

Eles são definidos em `tokens/src/semantic`, e seguem uma lógica diferentes dos demais tokens. Criamos um arquivo "principal", que define o valor do token como seu próprio nome, e arquivos secundários, definidos para cada tema, que contém o valor do token usado pela aplicação.

Um arquivo principal dos tokens semânticos é o `tokens/src/semantic/color/color.json`:

```json
{
  "dsa": {
    "color": {
      "bg": {
        "1": {
          "value": "DSA_COLOR_BG_1"
        },
        "2": {
          "value": "DSA_COLOR_BG_2"
        }
      },
    ...
    }
  }
}
```

E, um arquivo secundário, para o tema escuro, por exemplo, é o `tokens/src/semantic/color/color.dark.json`:

```json
{
  "dsa": {
    "color": {
      "bg": {
        "1": {
          "value": "{color.neutral.darkest}"
        },
        "2": {
          "value": "{color.neutral.xxdark}"
        }
      },
    ...
    }
  }
}
```

Esses arquivos consomem os tokens "core", criados anteriormente.

## 2. Obter o valor do token semântico de acordo com o tema

Para que a aplicação consiga obter o valor correto para cada tema, criamos a função `getThemeTokenValue`, definida em `themes/getThemeToken.ts`.
Essa função recebe o token do arquivo principal e retorna o valor dos arquivos secundários, de acordo com o tema - que é o segundo parâmetro da função. Um exemplo de uso seria:

```javascript
getThemeTokenValue(DSA_COLOR_BG_1, theme);
```

## 3. O controle de estado para o dark mode e o tema padrão

Primeiro, sobre o tema padrão, definimos o tema `light` como `defaultTheme` no arquivo `themes/themes.ts`.

Agora, para o controle de estado dos temas, usamos o `Context` do react, aplicado no `DarkModeEnabledProvider`, em `themes/DarkModeEnabledContext.tsx`.
Além do caso de uso simples, do `ReactContext`, esse provider também gerencia a persistência dessa informação, usando `@react-native-community/async-storage`, guardada em storages locais na variável `dsa_theme`.

---

A aplicação desses três pontos está exemplificada no componente customizado de bloco de documentação, em `utils/CustomDesignTokenDocBlock/index.tsx`, e seu funcionamento pode ser consultado no storybook do projeto - na aba de tokens semânticos.
