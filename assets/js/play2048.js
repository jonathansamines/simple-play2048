/**
 * play2048.js
 * Archivo de control del juego
 * @author Jonathan Samines
 */

/**
 * Tablero de Juego - define la lógica principal del tablero
 * @param {Object} config Parámetros de configuración del tablero.
 */
function TableroJuego(config){
	this.holder = document.getElementById(config.holderId);
	this.gridClass = config.gridClass;

	this.tablero = this.crearGridTablero();
	this.holder.appendChild(this.tablero);

	this.escucharEventosTablero();

	this.numeroBase = config.numeroBase;
	this.cantidadNumeros = config.cantidadNumeros;
	this.filaClass = config.filaClass;
	this.tabla = [];
}

TableroJuego.prototype.movimientos = {
	MOVIMIENTO_DERECHA : 39,
	MOVIMIENTO_IZQUIERDA : 37,
	MOVIMIENTO_ARRIBA : 38,
	MOVIMIENTO_ABAJO : 40
};

TableroJuego.prototype.escucharEventosTablero = function(){
	var me = this;

	window.addEventListener('keyup', function(evento){
		switch(evento.keyCode){
			case me.movimientos.MOVIMIENTO_DERECHA :
				me.movimientoDerecha();
				break;
			case me.movimientos.MOVIMIENTO_IZQUIERDA :
				me.movimientoIzquierda();
				break;
			case me.movimientos.MOVIMIENTO_ARRIBA :
				me.movimientoArriba();
				break;
			case me.movimientos.MOVIMIENTO_ABAJO :
				me.movimientoAbajo();
				break;
		}
	});
};

TableroJuego.prototype.movimientoIzquierda = function(){};
TableroJuego.prototype.movimientoArriba = function(){};
TableroJuego.prototype.movimientoAbajo = function(){};


TableroJuego.prototype.movimientoDerecha = function(){
	var sumaRealizada = false;
	for(var fila = 0; fila < this.cantidadNumeros; fila++){
		sumaRealizada = false;


		for(var columna = 0; columna < this.cantidadNumeros; columna++){
			var itemTablero = this.tabla[fila][columna],
				referencias = this.calcularReferenciasItem(fila, columna);

			console.log('El item en la posicion [%s, %s] tiene el valor : %s', fila, columna, itemTablero.valor);
			
			// si hay un item a la derecha, entonces es posible mover el item
			if(referencias.itemDerecho !== undefined){

				// la pieza solo se mueve a la derecha, si el item tiene un valor válido
				if(itemTablero.valor){
					
					// si el valor a la derecha, es un valor identico al actual
					// se pueden sumar ambos valores
					if(itemTablero.valor === referencias.itemDerecho.valor && !sumaRealizada){
						itemTablero.obtenerRepresentacionGrafica().textContent = '';

						var suma = Number(itemTablero.valor) + Number(referencias.itemDerecho.valor);
						
						referencias.itemDerecho.obtenerRepresentacionGrafica().textContent = suma;
						referencias.itemDerecho.valor = suma;
						itemTablero.valor = '';
						sumaRealizada = true;

					}else if(referencias.itemDerecho.valor === ''){
						itemTablero.obtenerRepresentacionGrafica().textContent = '';
						referencias.itemDerecho.obtenerRepresentacionGrafica().textContent = itemTablero.valor;
						referencias.itemDerecho.valor = itemTablero.valor;
						
						itemTablero.valor = '';
					}

					
				}else{
					console.log('El item tiene un valor no valido para moverlo.');
				}
			}else{
				console.log('No hay items a la derecha del item actual. \n\n');
			}
		}
	}

	// se genera un nuevo item de forma aleatoria
	while(true){
		var alpos = { fila : this.generarPosicionAleatoria(), columna : this.generarPosicionAleatoria() };
		var item = this.tablero.querySelector('[data-coordinates="' + alpos.fila + '-' + alpos.columna + '"]');
		var nuevo = this.tabla[alpos.fila][alpos.columna];

		if(this.tabla[alpos.fila][alpos.columna].valor === ''){
			nuevo.valor = this.numeroBase;

			item.setAttribute('class', 'game-column new-item');
			item.textContent = nuevo.valor;
			
			// se elimina el indicador de "nuevo-item"
			setTimeout(function(){
				item.setAttribute('class', 'game-column');
			}, 1000);

			this.tabla[alpos.fila][alpos.columna] = nuevo;
			break;
		}
	}

	if(intents >= this.cantidadNumeros){
		console.log(' JUEGO FINALIZADO. ');
	}
};

TableroJuego.prototype.crearGridTablero = function(){
	var tablero = document.createElement('section');
	tablero.setAttribute('class', this.gridClass);

	return tablero;
};

TableroJuego.prototype.crearFilaTablero = function(indiceColumna){
	var filaTablero = document.createElement('div');
	filaTablero.setAttribute('indice-columna', indiceColumna);
	filaTablero.setAttribute('class', this.filaClass);

	return filaTablero;
};

TableroJuego.prototype.calcularReferenciasItem = function(fila, columna){
	var referencias = {
		itemSuperior : this.tabla[fila - 1] && this.tabla[fila - 1][columna],
		itemInferior : this.tabla[fila + 1] && this.tabla[fila + 1][columna],
		itemDerecho  : this.tabla[fila] && this.tabla[fila][columna + 1],
		itemIzquiero : this.tabla[fila] && this.tabla[fila][columna - 1]
	};

	return referencias;
};

TableroJuego.prototype.generarPosicionAleatoria = function(){
	var minimo = 0,
		maximo = this.cantidadNumeros;

	// se calcula la posicion aleatoria
	var random = Math.random() * ( maximo - minimo ) + minimo;

	return Math.floor(random);
};

TableroJuego.prototype.dibujarTablero = function(){
	// se genera una posicion aleatoria, 
	// para el número que inicialmente es establecido
	var aleatorios = [
		{ fila : this.generarPosicionAleatoria(), columna : this.generarPosicionAleatoria() },
		{ fila : this.generarPosicionAleatoria(), columna : this.generarPosicionAleatoria() }
	];
	var filaAleatoria = this.generarPosicionAleatoria(),
		columnaAleatoria = this.generarPosicionAleatoria();

	for(var fila = 0; fila < this.cantidadNumeros; fila++){
		this.tabla[fila] = [];

		// se crea un fila del tablero
		var filaTablero = this.crearFilaTablero(fila);

		for(var columna = 0; columna < this.cantidadNumeros; columna++){
			var valor = aleatorios[0].fila === fila && columna === aleatorios[0].columna ? this.numeroBase : '';
				valor = valor || (aleatorios[1].fila === fila && columna === aleatorios[1].columna ? this.numeroBase : '');
			

			// se crea un item del tablero
			var itemTablero = new ItemTablero({
				valor : valor,
				itemClass : 'game-column',
				fila : fila,
				columna : columna
			});

			filaTablero.appendChild(itemTablero.crearRepresentacionGrafica());
			this.tabla[fila][columna] = itemTablero;
		}

		this.tablero.appendChild(filaTablero);
	}
};


/**
 * ItemTablero - Representa una columna o item del tablero,
 * la cual representa un valor númerico del juego.
 * @param {Object} config Parametros de configuración del objeto.
 */
function ItemTablero(config){
	this.valor = config.valor;
	this.fila = config.fila;
	this.columna = config.columna;

	this.itemClass = config.itemClass;
}

/**
 * Crea la representación gráfica de un elemento del tablero.
 * @return {HTMLElement} Elemento html creado para representar el item.
 */
ItemTablero.prototype.crearRepresentacionGrafica = function(){
	var itemTablero = document.createElement('span');

	itemTablero.setAttribute('data-coordinates', this.fila + '-' + this.columna);
	itemTablero.setAttribute('class', this.itemClass);
	itemTablero.textContent = this.valor;

	return itemTablero;
};

ItemTablero.prototype.obtenerRepresentacionGrafica = function(){
	return document.querySelector('[data-coordinates="' + this.fila + '-' + this.columna + '"]');
};

window.addEventListener('DOMContentLoaded', function(){
	var tablero = new TableroJuego({
		holderId : 'game',
		gridClass : 'game-grid',
		filaClass : 'game-row',
		numeroBase : 2,
		cantidadNumeros : 4
	});

	tablero.dibujarTablero();
});