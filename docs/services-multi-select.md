# ServicesMultiSelect - Componente Multi-Select

Um componente de seleção múltipla moderno e acessível, similar ao Mantine MultiSelect, construído com shadcn/ui.

## Características

- ✅ **Seleção múltipla** - Permite selecionar vários serviços
- ✅ **Busca integrada** - Campo de busca para filtrar serviços
- ✅ **Tags visuais** - Mostra serviços selecionados como badges
- ✅ **Remoção individual** - Clique no X para remover cada serviço
- ✅ **Limite de seleções** - Controle máximo de itens selecionados
- ✅ **Acessibilidade** - Suporte completo a teclado e screen readers
- ✅ **Loading state** - Indicador de carregamento
- ✅ **Responsivo** - Adapta-se a diferentes tamanhos de tela

## Uso Básico

```tsx
import { ServicesMultiSelect } from '@/components/services-multi-select'

function MyComponent() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  return (
    <ServicesMultiSelect
      selectedServices={selectedServices}
      onServicesChange={setSelectedServices}
      placeholder="Selecione serviços"
    />
  )
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `selectedServices` | `string[]` | `[]` | Array de IDs dos serviços selecionados |
| `onServicesChange` | `(serviceIds: string[]) => void` | - | Callback chamado quando a seleção muda |
| `placeholder` | `string` | `"Selecione serviços"` | Texto placeholder quando nenhum serviço está selecionado |
| `maxSelections` | `number` | - | Número máximo de serviços que podem ser selecionados |
| `className` | `string` | - | Classes CSS adicionais |

## Exemplos de Uso

### Seleção Simples

```tsx
function SimpleExample() {
  const [services, setServices] = useState<string[]>([])

  return (
    <ServicesMultiSelect
      selectedServices={services}
      onServicesChange={setServices}
      placeholder="Escolha seus serviços"
    />
  )
}
```

### Com Limite de Seleções

```tsx
function LimitedExample() {
  const [services, setServices] = useState<string[]>([])

  return (
    <ServicesMultiSelect
      selectedServices={services}
      onServicesChange={setServices}
      placeholder="Máximo 3 serviços"
      maxSelections={3}
    />
  )
}
```

### Com Classes Personalizadas

```tsx
function StyledExample() {
  const [services, setServices] = useState<string[]>([])

  return (
    <ServicesMultiSelect
      selectedServices={services}
      onServicesChange={setServices}
      placeholder="Serviços personalizados"
      className="w-full max-w-md"
    />
  )
}
```

### Em Formulário com React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form'
import { ServicesMultiSelect } from '@/components/services-multi-select'

function FormExample() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      services: []
    }
  })

  const onSubmit = (data: any) => {
    console.log('Serviços selecionados:', data.services)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="services"
        control={control}
        render={({ field }) => (
          <ServicesMultiSelect
            selectedServices={field.value}
            onServicesChange={field.onChange}
            placeholder="Selecione os serviços"
            maxSelections={5}
          />
        )}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Funcionalidades

### Busca e Filtro

O componente inclui um campo de busca integrado que filtra os serviços em tempo real:

- Digite para buscar por nome do serviço
- A busca é case-insensitive
- Resultados são mostrados instantaneamente

### Tags Visuais

Os serviços selecionados são exibidos como badges:

- Cada serviço aparece como uma tag
- Botão X para remover individualmente
- Suporte a teclado (Enter para remover)
- Layout responsivo com quebra de linha

### Limite de Seleções

Quando `maxSelections` é definido:

- Contador visual mostra seleções atuais/máximo
- Novas seleções são bloqueadas quando o limite é atingido
- Feedback visual claro

### Estados de Loading

- Indicador de carregamento durante busca de serviços
- Mensagem de "Nenhum serviço encontrado" quando não há resultados
- Estados de erro tratados graciosamente

## Acessibilidade

O componente é totalmente acessível:

- **Navegação por teclado** - Use Tab para navegar, Enter para selecionar
- **Screen readers** - Anúncios apropriados para mudanças de estado
- **ARIA labels** - Atributos ARIA corretos para combobox
- **Foco visível** - Indicadores de foco claros
- **Remoção por teclado** - Enter no botão X remove o serviço

## Integração com APIs

O componente usa o hook `useShared` para buscar serviços:

```tsx
// O hook já está integrado no componente
const { servicesQuery } = useShared()
const { data: services, isLoading } = servicesQuery
```

Para usar com dados customizados, você pode modificar o hook ou criar uma versão customizada do componente.

## Estilização

O componente usa as classes do Tailwind CSS e shadcn/ui:

- **Tema consistente** - Segue o design system da aplicação
- **Modo escuro** - Suporte automático a temas
- **Responsivo** - Adapta-se a diferentes tamanhos
- **Customizável** - Aceita classes CSS adicionais

## Comparação com Mantine

| Funcionalidade | Mantine MultiSelect | ServicesMultiSelect |
|----------------|-------------------|-------------------|
| Seleção múltipla | ✅ | ✅ |
| Busca integrada | ✅ | ✅ |
| Tags visuais | ✅ | ✅ |
| Limite de seleções | ✅ | ✅ |
| Acessibilidade | ✅ | ✅ |
| Customização | ✅ | ✅ |
| Performance | ✅ | ✅ |

## Troubleshooting

### Problema: Serviços não carregam
**Solução**: Verifique se o hook `useShared` está funcionando corretamente e se a API está retornando dados.

### Problema: Seleções não persistem
**Solução**: Certifique-se de que `onServicesChange` está atualizando o estado corretamente.

### Problema: Layout quebrado em telas pequenas
**Solução**: O componente é responsivo por padrão, mas você pode ajustar com classes CSS customizadas.

### Problema: Acessibilidade não funciona
**Solução**: Verifique se todos os atributos ARIA estão sendo aplicados corretamente e teste com screen readers.
