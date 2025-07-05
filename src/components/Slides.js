// src/components/Slides.js
import React from 'react';
import Slider from 'react-slick';
import styles from '@/styles/Slides.module.css';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    titulo: 'Começa a Treinar Hoje',
    descricao: 'Descobre tudo para começares o teu percurso fitness. Desde roupa desportiva até acessórios essenciais para treinos em casa ou no ginásio.',
    botaoTexto: 'Começar Agora',
    termoPesquisa: 'fitness',
    imagem: 'https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338230/slide-treinar-hoje_qx3onc.jpg',
  },
  {
    titulo: 'Relax Total',
    descricao: 'Relaxar é essencial. Encontra tudo o que precisas para o teu conforto este verão.',
    botaoTexto: 'Ver Mais',
    termoPesquisa: 'conforto',
    imagem: 'https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338223/slide-relax_bif2gb.jpg',
  },
  {
    titulo: 'Escapadinhas de Fim de Semana',
    descricao: 'O descanso que mereces. Equipamento ideal para aventuras ao ar livre.',
    botaoTexto: 'Explorar',
    termoPesquisa: 'campismo',
    imagem: 'https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338224/slide-escapadinha_c9sjjq.jpg',
  },
  {
    titulo: 'Kids em Movimento',
    descricao: 'Roupa e acessórios para os mais novos se manterem ativos com conforto.',
    botaoTexto: 'Ver Infantil',
    termoPesquisa: 'infantil',
    imagem: 'https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338472/slide-kids_agnyt2.jpg',
  },
];

const Slides = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: false, // 🔴 DESATIVADO fade para backgroundImage funcionar corretamente
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Destaques do Verão</h2>
      <Slider {...settings} className={styles.slider}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className={styles.slide}
              style={{ backgroundImage: `url(${slide.imagem})` }}
            >
              <div className={styles.overlay}></div>
              <div className={styles.slideContent}>
                <h3>{slide.titulo}</h3>
                <p>{slide.descricao}</p>
                <Link href={`/pesquisa?q=${encodeURIComponent(slide.termoPesquisa)}`} passHref>
                  <button>
                    {slide.botaoTexto}
                    <ArrowRight size={18} style={{ marginLeft: 8 }} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slides;
