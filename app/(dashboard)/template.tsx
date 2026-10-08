// ============================================================
// ANCOREO — Template do painel.
// Um template.tsx remonta a cada navegação; o layout não. É o único gancho
// que o App Router dá pra marcar "a tela trocou" sem JavaScript de rota.
// Serve só pra isso: embrulhar o conteúdo e deixar o CSS fazer um fade curto.
// A sidebar, o banner do Google e o shell ficam de fora, parados, que é o
// comportamento de aplicativo: o miolo troca, a moldura não pisca.
// ============================================================
export default function PainelTemplate({ children }: { children: React.ReactNode }) {
  return <div className="rota-entra">{children}</div>
}
