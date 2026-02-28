export interface PowerBiEmbedProps {
  /** URL do relatório Power BI (link de compartilhamento). */
  embedUrl: string
  /** Título acessível para o iframe. */
  title?: string
  /** Classe CSS do container. */
  className?: string
}

/**
 * Embed do Power BI via iframe.
 *
 * Link de compartilhamento (view?r=...): pode exigir login dentro do iframe.
 * O Power BI às vezes bloqueia embed em outros domínios (X-Frame-Options).
 *
 * Segurança: use apenas URLs confiáveis definidas em código. Não injete embedUrl a partir
 * de input do usuário sem validação (ex.: allowlist de domínios) para evitar abuso.
 * O CSP do projeto deve permitir frame-src para *.powerbi.com (e *.outlook.com se usar Safelinks).
 */
export function PowerBiEmbed({
  embedUrl,
  title = "Dashboard Power BI",
  className,
}: PowerBiEmbedProps) {
  return (
    <div className={className}>
      <iframe
        title={title}
        src={embedUrl}
        className="w-full min-h-[100vh] border-0 rounded-lg"
        allowFullScreen
      />
    </div>
  )
}
