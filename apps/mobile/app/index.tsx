import { View, Text, Pressable, StatusBar } from "react-native";
import { Link } from "expo-router";

const C = { bg: "#080A0F", panel: "#121722", green: "#B7F36B", text: "#F5F7FA", muted: "#9AA4B2", line: "#252D3A" };

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 26, justifyContent: "space-between" }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={{ marginTop: 76 }}>
        <View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: C.green, alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <Text style={{ fontSize: 29, fontWeight: "900", color: C.bg }}>F</Text>
        </View>
        <Text style={{ color: C.text, fontSize: 38, fontWeight: "900", letterSpacing: -1.3 }}>Seu dinheiro.</Text>
        <Text style={{ color: C.green, fontSize: 38, fontWeight: "900", letterSpacing: -1.3 }}>Sua vida.</Text>
        <Text style={{ color: C.muted, fontSize: 17, lineHeight: 26, marginTop: 18, maxWidth: 320 }}>
          Organize seus gastos, acompanhe o que entra e saia do mês com mais tranquilidade.
        </Text>
      </View>
      <View style={{ backgroundColor: C.panel, borderColor: C.line, borderWidth: 1, borderRadius: 24, padding: 20, gap: 17 }}>
        {["Registre receitas e despesas em segundos", "Entenda para onde seu dinheiro vai", "Planeje metas sem planilhas"].map((s, i) => (
          <View key={s} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#24311D", alignItems: "center", justifyContent: "center" }}><Text style={{ color: C.green, fontWeight: "800" }}>{i + 1}</Text></View>
            <Text style={{ color: C.text, fontSize: 14, flex: 1 }}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 12, marginBottom: 18 }}>
        <Link href="/auth" asChild><Pressable style={{ backgroundColor: C.green, padding: 18, borderRadius: 16 }}><Text style={{ color: C.bg, textAlign: "center", fontWeight: "900", fontSize: 16 }}>Começar agora  →</Text></Pressable></Link>
        <Text style={{ color: C.muted, fontSize: 12, textAlign: "center" }}>Gratuito para começar · Seus dados protegidos</Text>
      </View>
    </View>
  );
}
