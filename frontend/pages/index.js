import Head from 'next/head';
import Link from 'next/link';
import { 
  BookOpen, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Users, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import styles from '../styles/index.module.css';
import ThemeToggle from '../components/menu/ThemeToggle';

export default function Home({ auth }) {
  return (
    <div>
      <Head>
        <title>Bookhub — Sua Rede Social de Livros e Avaliações</title>
        <meta name="description" content="Registre leituras, avalie livros com notas, escreva resenhas e compartilhe com a comunidade." />
      </Head>

      <div className={styles.app}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.nav}>
              <div className={styles.logo}>
                <BookOpen size={28} />
                <span>Bookhub</span>
              </div>
              <nav className={styles.navMenu}>
                <a href="#recursos" className={styles.navLink}>Recursos</a>
                <a href="#como-funciona" className={styles.navLink}>Como Funciona</a>
                <a href="#comunidade" className={styles.navLink}>Comunidade</a>
              </nav>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ThemeToggle />
                {auth?.user ? (
                  <Link href="/dashboard" className={styles.ctaButton}>
                    Meu Perfil
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link href="/login" className={styles.ctaButton}>
                    Entrar
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Sparkles size={16} />
                <span>Sua estante virtual completa</span>
              </div>
              <h1 className={styles.heroTitle}>
                Descubra, Avalie e Compartilhe <span className={styles.gradientText}>Seus Livros Favoritos</span>
              </h1>
              <p className={styles.heroDescription}>
                Organize suas leituras, dê notas, escreva resenhas detalhadas e acompanhe o que seus amigos e a comunidade literária estão lendo.
              </p>
              <div className={styles.heroCta}>
                <Link href="/login" className={styles.ctaButtonPrimary}>
                  Começar Agora
                  <ArrowRight size={20} />
                </Link>
                <a href="#recursos" className={styles.ctaButtonSecondary}>
                  Explorar Recursos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="recursos" className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Tudo o que um leitor precisa</h2>
              <p className={styles.sectionDescription}>
                Ferramentas pensadas para enriquecer o seu hábito e histórico de leitura.
              </p>
            </div>

            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Bookmark size={24} />
                </div>
                <h3 className={styles.featureTitle}>Estante Virtual</h3>
                <p className={styles.featureDescription}>
                  Marque livros como "Lendo", "Lido", "Quero Ler" ou "Abandonado" com total facilidade.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Star size={24} />
                </div>
                <h3 className={styles.featureTitle}>Avaliações e Notas</h3>
                <p className={styles.featureDescription}>
                  Atribua notas de 1 a 5 estrelas e veja a média geral dos leitores em tempo real.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <MessageSquare size={24} />
                </div>
                <h3 className={styles.featureTitle}>Resenhas e Comentários</h3>
                <p className={styles.featureDescription}>
                  Escreva resenhas completas com suas impressões e comente nas avaliações de outros leitores.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Users size={24} />
                </div>
                <h3 className={styles.featureTitle}>Comunidade de Leitores</h3>
                <p className={styles.featureDescription}>
                  Siga outros leitores, veja o progresso de amigos e receba recomendações personalizadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerBottom}>
              <p>&copy; {new Date().getFullYear()} Bookhub. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}