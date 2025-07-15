    const formulario = document.getElementById('formulario_avistamento');
    const campoNome = document.getElementById('campo_nome_observador');
    const campoEmail = document.getElementById('campo_email');
    const campoData = document.getElementById('campo_data');
    const campoHora = document.getElementById('campo_hora');
    const campoLocal = document.getElementById('campo_local');
    const campoFormato = document.getElementById('campo_formato_objeto');
    const campoDescricao = document.getElementById('campo_descricao');
    const areaRelatorios = document.getElementById('area_relatorios');
    const botaoLimparTudo = document.getElementById('botao_limpar_tudo');
    
    const erroNome = document.getElementById('erro_nome_observador');
    const erroData = document.getElementById('erro_data');
    const erroHora = document.getElementById('erro_hora');
    const erroLocal = document.getElementById('erro_local');
    const erroFormato = document.getElementById('erro_formato_objeto');
    const erroDescricao = document.getElementById('erro_descricao');

    function validarFormulario() {
        let eValido = true;
        
        erroNome.style.display = 'none'; campoNome.classList.remove('input-erro');
        erroData.style.display = 'none'; campoData.classList.remove('input-erro');
        erroHora.style.display = 'none'; campoHora.classList.remove('input-erro');
        erroLocal.style.display = 'none'; campoLocal.classList.remove('input-erro');
        erroFormato.style.display = 'none'; campoFormato.classList.remove('input-erro');
        erroDescricao.style.display = 'none'; campoDescricao.classList.remove('input-erro');
        
        if (campoNome.value.trim() === '') {
            erroNome.textContent = 'O nome é obrigatório.'; erroNome.style.display = 'block'; campoNome.classList.add('input-erro'); eValido = false;
        }
        if (campoData.value === '') {
            erroData.textContent = 'A data é obrigatória.'; erroData.style.display = 'block'; campoData.classList.add('input-erro'); eValido = false;
        }
        if (campoHora.value === '') {
            erroHora.textContent = 'A hora é obrigatória.'; erroHora.style.display = 'block'; campoHora.classList.add('input-erro'); eValido = false;
        }
        if (campoLocal.value.trim() === '') {
            erroLocal.textContent = 'O local é obrigatório.'; erroLocal.style.display = 'block'; campoLocal.classList.add('input-erro'); eValido = false;
        }
        if (campoFormato.value === '') {
            erroFormato.textContent = 'Selecione um formato.'; erroFormato.style.display = 'block'; campoFormato.classList.add('input-erro'); eValido = false;
        }
        if (campoDescricao.value.trim().length < 20) {
            erroDescricao.textContent = 'A descrição precisa ter pelo menos 20 caracteres.'; erroDescricao.style.display = 'block'; campoDescricao.classList.add('input-erro'); eValido = false;
        }
        return eValido;
    }

    function limparRelatorios() {
        const todosOsRelatorios = document.querySelectorAll('#area_relatorios .relatorio-card');
        for (const relatorio of todosOsRelatorios) {
            relatorio.remove();
        }
    }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();

        if (validarFormulario()) {

            const novoRelatorio = document.createElement('div');
            novoRelatorio.className = 'relatorio-card';

            const titulo = document.createElement('h4');
            titulo.textContent = `Relatório de ${campoNome.value}`;

            const dataHora = document.createElement('p');
            dataHora.innerHTML = `<strong>Data e Hora:</strong> ${campoData.value} às ${campoHora.value}`;

            const local = document.createElement('p');
            local.innerHTML = `<strong>Local:</strong> ${campoLocal.value}`;

            const formato = document.createElement('p');
            formato.innerHTML = `<strong>Formato do Objeto:</strong> ${campoFormato.value}`;

            const descricao = document.createElement('blockquote');
            descricao.textContent = `"${campoDescricao.value}"`;
            
            novoRelatorio.appendChild(titulo);
            novoRelatorio.appendChild(dataHora);
            novoRelatorio.appendChild(local);
            novoRelatorio.appendChild(formato);
            novoRelatorio.appendChild(descricao);
            
            areaRelatorios.appendChild(novoRelatorio);

            formulario.reset();
        }
    });

    botaoLimparTudo.addEventListener('click', limparRelatorios);