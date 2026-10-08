import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";

export default function Auth() {
 const [email,setEmail]=useState("");
 return <View style={{flex:1,padding:24,justifyContent:"center",gap:14}}>
  <Text style={{fontSize:28,fontWeight:"800"}}>Acesse sua conta</Text>
  <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="seu@email.com" value={email} onChangeText={setEmail} style={{borderWidth:1,borderRadius:12,padding:14}}/>
  <Pressable onPress={()=>Alert.alert("FinLife","A autenticação Supabase será conectada nesta etapa.")} style={{padding:16,borderRadius:14,backgroundColor:"#111"}}><Text style={{color:"#fff",textAlign:"center",fontWeight:"700"}}>Continuar</Text></Pressable>
 </View>;
}