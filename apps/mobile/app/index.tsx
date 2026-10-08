import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return <View style={{flex:1,padding:24,justifyContent:"center",gap:18}}>
    <Text style={{fontSize:32,fontWeight:"800"}}>FinLife</Text>
    <Text style={{fontSize:18}}>Seu dinheiro, mais simples.</Text>
    <Link href="/auth" asChild><Pressable style={{padding:16,borderRadius:14,backgroundColor:"#111"}}><Text style={{color:"#fff",textAlign:"center",fontWeight:"700"}}>Entrar</Text></Pressable></Link>
  </View>;
}