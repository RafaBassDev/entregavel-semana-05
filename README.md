## Reflexão

### Por que Promise.all pode ser mais rápido que vários await seguidos?

Quando usamos vários `await` em sequência uma operação precisa terminar para só depois a próxima começar.

Por exemplo:

```javascript
const resposta1 = await fetch(url1);
const resposta2 = await fetch(url2);
```

Nesse caso, a segunda requisição só começa depois que a primeira termina.

Com `Promise.all`, as requisições podem começar praticamente ao mesmo tempo:

```javascript
const [resposta1, resposta2] = await Promise.all([
    fetch(url1),
    fetch(url2)
]);
```

Isso pode deixar o processo mais rápido quando uma requisição não depende da outra, porque o tempo de espera da rede é aproveitado melhor.

De forma resumida, com vários `await` seguidos as requisições acontecem uma depois da outra. Com `Promise.all`, elas podem acontecer em paralelo e o código espera todas terminarem para continuar.