// encontrar o botão adicionar tarefa

const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form_add_task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const pTaskDescription = document.querySelector(
  '.app__section-active-task-description'
);

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

const cancelTask = document.querySelector('.app__form-footer__button--cancel');

const clearText = () => {
  textarea.value = '';
  formAdicionarTarefa.classList.toggle('hidden');
};

cancelTask.addEventListener('click', clearText);

function atualizarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');

  const svg = document.createElement('svg');
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;
  const paragrafo = document.createElement('p');
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add('app__section-task-list-item-description');

  const botao = document.createElement('button');
  botao.classList.add('app_button-edit');

  botao.onclick = () => {
    // debugger;
    const novaDescricao = prompt('Qual é o novo nome da tarefa?');
    if (novaDescricao) {
      paragrafo.textContent = novaDescricao;
      tarefa.descricao = novaDescricao;
      atualizarTarefas();
    }
  };

  const imagemBotao = document.createElement('img');
  imagemBotao.setAttribute('src', '/imagens/edit.png');
  botao.append(imagemBotao);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefa.completa) {
    li.classList.add('app__section-task-list-item-complete');
    botao.setAttribute('disable', 'disabled');
  } else {
    li.onclick = () => {
      document
        .querySelectorAll('.app__section-task-list-item-active')
        .forEach((elemento) => {
          elemento.classList.remove('app__section-task-list-item-active');
        });
      if (tarefaSelecionada == tarefa) {
        pTaskDescription.textContent = '';
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }
      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      pTaskDescription.textContent = tarefa.descricao;

      li.classList.add('app__section-task-list-item-active');
    };
  }

  //highlight clicked list and remove highlight from others

  return li;
}

btnAdicionarTarefa.addEventListener('click', () => {
  formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const tarefa = {
    descricao: textarea.value,
  };
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  textarea.value = '';
  formAdicionarTarefa.classList.add('hidden');
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liTarefaSelecionada
      .querySelector('button')
      .setAttribute('disabled', 'disabled');
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  //if ternário/diferenciado
  const seletor = somenteCompletas
    ? '.app__section-task-list-item-complete'
    : '.app__section-task-list-item';
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  // tarefas = tarefas.filter((tarefa) => !tarefa.completa);
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
