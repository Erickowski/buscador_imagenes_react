import React,{Component} from 'react';
import Buscador from './componentes/Buscador';
import Resultado from './componentes/Resultado';
import './App.css';

export default class App extends Component {

  state = {
    termino:'',
    imagenes: [],
    pagina: '',
    cargando: false,
    totalPaginas: ''
  }

  consultarAPI = async () => {
    const termino = this.state.termino;
    const pagina = this.state.pagina;
    const url = `https://pixabay.com/api/?key=12389935-8c8ab8f2ed590d8476ce61b6d&q=${termino}&per_page=30&page=${pagina}`;
    await fetch(url)
      .then(respuesta => {
        this.setState({
          cargando: true
        });
        return respuesta.json();
      })
      .then(resultado => {
        //retornar hacia arriba
        const totalPaginacion = Math.ceil(resultado.totalHits / 30)
        setTimeout(() => {
          this.setState({
            imagenes: resultado.hits,
            cargando: false,
            totalPaginas: totalPaginacion
          })
        }, 2000);
      })
  }

  datosBusqueda = (termino) => {
    this.setState({
      termino : termino,
      pagina : 1
    }//callback: coma y despues un arrow function
    , () => {
      this.consultarAPI();
    });
  }

  paginaAnterior = () => {
    let pagina = this.state.pagina;
    if( pagina === 1 ) return null;
    pagina -= 1;
    this.setState({
      pagina
    }, () => {
      this.scroll();
      this.consultarAPI();
    });
  }

  paginaSiguiente = () => {
    let {pagina} = this.state;
    const {totalPaginas} = this.state;
    if( pagina === totalPaginas) return null;
    pagina += 1;
    this.setState({
      pagina
    }, () => {
      this.scroll();
      this.consultarAPI();
    });
  }

  scroll = () => {
    //recorrer cuando regrese o avance de ápagin
    const elemento = document.querySelector('#resultado');
    /**otra forma, nos lleva hasta el inicio
     * const elemento = document.querySelector('.jumbotron');
     */
    elemento.scrollIntoView('auto', 'start');
    /**Otro efecto
     * elemento.scrollIntoView('smooth', 'start');
     */
  }

    render() {
      const cargando = this.state.cargando;
      let resultado;
      if(cargando){
        resultado = <div class="sk-cube-grid">
                      <div class="sk-cube sk-cube1"></div>
                      <div class="sk-cube sk-cube2"></div>
                      <div class="sk-cube sk-cube3"></div>
                      <div class="sk-cube sk-cube4"></div>
                      <div class="sk-cube sk-cube5"></div>
                      <div class="sk-cube sk-cube6"></div>
                      <div class="sk-cube sk-cube7"></div>
                      <div class="sk-cube sk-cube8"></div>
                      <div class="sk-cube sk-cube9"></div>
                    </div>
      } else {
        resultado = <Resultado 
                      imagenes={this.state.imagenes}
                      paginaAnterior={this.paginaAnterior}
                      paginaSiguiente={this.paginaSiguiente}
                      pagina={this.state.pagina}
                      totalPaginas={this.state.totalPaginas}
                    />
      }
        return (
            <div className="app container">
                <div className="jumbotron">
                  <p className="lead text-center">Buscador de imágenes</p>
                  <Buscador 
                    datosBusqueda={this.datosBusqueda}
                  />
                </div>
                <div className="row justify-content-center">
                  {resultado}
                </div>
            </div>
        );
    }
}
