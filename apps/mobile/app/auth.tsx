import { View,Text,TextInput,Pressable,Alert,KeyboardAvoidingView,Platform,ScrollView } from "react-native";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
const C={bg:"#080A0F",panel:"#121722",green:"#B7F36B",text:"#F5F7FA",muted:"#9AA4B2",line:"#252D3A"};
const input={backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:14,padding:16,color:C.text,fontSize:16};
export default function Auth(){
 const [mode,setMode]=useState<"login"|"signup">("signup");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [loading,setLoading]=useState(false);
 async function login(){if(!email.trim()||!password)return Alert.alert("FinLife","Informe seu e-mail e senha.");setLoading(true);try{const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;router.replace("/dashboard");}catch(e:any){Alert.alert("Não foi possível entrar",e?.message||"Confira os dados e tente novamente.");}finally{setLoading(false);}}
 async function signup(){if(!email.trim()||!email.includes("@"))return Alert.alert("Confira seu e-mail","Digite um endereço de e-mail válido.");if(password.length<6)return Alert.alert("Crie uma senha segura","Use pelo menos 6 caracteres.");setLoading(true);try{const {data,error}=await supabase.auth.signUp({email:email.trim(),password});if(error)throw error;if(data.session){router.replace("/dashboard");return;}Alert.alert("Quase lá!","Sua conta foi criada. Se o FinLife pedir confirmação por e-mail, confirme a mensagem e depois volte aqui para entrar.",[{text:"Entendi",onPress:()=>setMode("login")}]);}catch(e:any){Alert.alert("Não foi possível criar a conta",e?.message||"Tente novamente em instantes.");}finally{setLoading(false);}}
 return <KeyboardAvoidingView style={{flex:1,backgroundColor:C.bg}} behavior={Platform.OS==="ios"?"padding":undefined}><ScrollView contentContainerStyle={{flexGrow:1,padding:24,justifyContent:"center"}} keyboardShouldPersistTaps="handled">
 <Pressable onPress={()=>router.replace("/")} style={{marginBottom:30}}><Text style={{color:C.muted,fontSize:15}}>‹  Voltar</Text></Pressable>
 <View style={{width:56,height:56,borderRadius:18,backgroundColor:C.green,alignItems:"center",justifyContent:"center",marginBottom:24}}><Text style={{fontSize:30,fontWeight:"900",color:C.bg}}>F</Text></View>
 <Text style={{color:C.text,fontSize:30,fontWeight:"900"}}>{mode==="signup"?"Vamos organizar seu dinheiro.":"Que bom ter você de volta."}</Text>
 <Text style={{color:C.muted,fontSize:15,lineHeight:23,marginTop:10,marginBottom:28}}>{mode==="signup"?"Crie seu acesso gratuito. Sua carteira será criada automaticamente no primeiro lançamento.":"Entre para ver seu saldo e suas movimentações."}</Text>
 <Text style={{color:C.muted,fontSize:13,marginBottom:8}}>E-mail</Text><TextInput autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="voce@email.com" placeholderTextColor="#687384" value={email} onChangeText={setEmail} style={{...input,marginBottom:17}}/>
 <Text style={{color:C.muted,fontSize:13,marginBottom:8}}>Senha (mínimo 6 caracteres)</Text><TextInput secureTextEntry placeholder="Crie uma senha" placeholderTextColor="#687384" value={password} onChangeText={setPassword} style={{...input,marginBottom:22}}/>
 <Pressable disabled={loading} onPress={mode==="signup"?signup:login} style={{backgroundColor:C.green,padding:17,borderRadius:15,opacity:loading?0.6:1}}><Text style={{color:C.bg,textAlign:"center",fontSize:16,fontWeight:"900"}}>{loading?"Aguarde…":mode==="signup"?"Criar minha conta grátis":"Entrar no FinLife"}</Text></Pressable>
 <Pressable onPress={()=>setMode(mode==="signup"?"login":"signup")} style={{padding:18}}><Text style={{color:C.muted,textAlign:"center"}}>{mode==="signup"?"Já tem conta? Entrar":"Ainda não tem conta? Criar conta"}</Text></Pressable>
 <Text style={{color:C.muted,fontSize:12,textAlign:"center",lineHeight:18}}>Não é necessário cadastrar banco ou carteira manualmente para começar.</Text>
 </ScrollView></KeyboardAvoidingView>;
}