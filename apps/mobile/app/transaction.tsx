import { useState } from "react";
import { View,Text,TextInput,Pressable,Alert,ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import { useLocalSearchParams,router } from "expo-router";
import { supabase } from "../lib/supabase";
const C={bg:"#080A0F",panel:"#121722",green:"#B7F36B",text:"#F5F7FA",muted:"#9AA4B2",line:"#252D3A",red:"#FF7777"};
const field={backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:14,padding:16,color:C.text,fontSize:16};
export default function Transaction(){
const params=useLocalSearchParams<{type?:string}>();const [type,setType]=useState<"despesa"|"receita">(params.type==="receita"?"receita":"despesa");const [value,setValue]=useState("");const [desc,setDesc]=useState("");const [loading,setLoading]=useState(false);
async function save(){
const amount=Number(value.trim().replace(/\s/g,"").replace(/\.(?=\d{3}(?:\D|$))/g,"").replace(",","."));
if(!Number.isFinite(amount)||amount<=0)return Alert.alert("Informe o valor","Digite um valor maior que zero, por exemplo 35,90.");
if(!desc.trim())return Alert.alert("Dê um nome ao lançamento","Ex.: mercado, almoço, salário ou transporte.");
setLoading(true);
try{
const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Entre no FinLife para salvar suas movimentações.");
const {error:pe}=await supabase.from("finlife_usuarios").upsert({id:user.id,nome:user.email?.split("@")[0]??"Pessoa"});if(pe)throw pe;
let {data:account,error:ae}=await supabase.from("finlife_contas").select("id,saldo_centavos").eq("usuario_id",user.id).order("created_at").limit(1).maybeSingle();if(ae)throw ae;
if(!account){const c=await supabase.from("finlife_contas").insert({usuario_id:user.id,nome:"Minha carteira",tipo:"carteira",saldo_centavos:0}).select("id,saldo_centavos").single();if(c.error)throw c.error;account=c.data;}
const categoryName=type==="receita"?"Outras receitas":"Outros gastos";
let {data:category,error:ce}=await supabase.from("finlife_categorias").select("id").eq("usuario_id",user.id).eq("tipo",type).eq("nome",categoryName).maybeSingle();if(ce)throw ce;
if(!category){const c=await supabase.from("finlife_categorias").insert({usuario_id:user.id,nome:categoryName,tipo:type,icone:type==="receita"?"wallet":"receipt"}).select("id").single();if(c.error)throw c.error;category=c.data;}
const cents=Math.round(amount*100);const {error:te}=await supabase.from("finlife_transacoes").insert({usuario_id:user.id,conta_id:account.id,categoria_id:category.id,tipo:type,valor_centavos:cents,descricao:desc.trim(),data_transacao:new Date().toISOString().slice(0,10)});if(te)throw te;
const delta=type==="receita"?cents:-cents;const {error:ue}=await supabase.from("finlife_contas").update({saldo_centavos:Number(account.saldo_centavos??0)+delta}).eq("id",account.id).eq("usuario_id",user.id);if(ue)throw ue;
setLoading(false);Alert.alert("Lançamento salvo ✓","Registramos sua movimentação e atualizamos o saldo.",[{text:"Ver resumo",onPress:()=>router.replace("/dashboard")}]);
}catch(e:any){setLoading(false);Alert.alert("Não foi possível salvar",e?.message??"Verifique a conexão e tente novamente.");}}
return <KeyboardAvoidingView style={{flex:1,backgroundColor:C.bg}} behavior={Platform.OS==="ios"?"padding":undefined}><ScrollView contentContainerStyle={{padding:22,paddingTop:54,paddingBottom:35}} keyboardShouldPersistTaps="handled">
<Pressable onPress={()=>router.back()} style={{marginBottom:26}}><Text style={{color:C.muted,fontSize:15}}>‹  Voltar ao resumo</Text></Pressable>
<Text style={{color:C.text,fontSize:29,fontWeight:"900"}}>Nova movimentação</Text><Text style={{color:C.muted,fontSize:15,lineHeight:22,marginTop:8,marginBottom:24}}>Registre o que entrou ou saiu. O FinLife atualiza seu saldo automaticamente.</Text>
<View style={{flexDirection:"row",backgroundColor:C.panel,padding:5,borderRadius:15,marginBottom:25}}>{(["despesa","receita"] as const).map(t=><Pressable key={t} onPress={()=>setType(t)} style={{flex:1,padding:14,borderRadius:11,backgroundColor:type===t?(t==="receita"?"#26361E":"#382124"):"transparent"}}><Text style={{textAlign:"center",color:type===t?(t==="receita"?C.green:C.red):C.muted,fontWeight:"900"}}>{t==="despesa"?"−  Gasto":"+  Receita"}</Text></Pressable>)}</View>
<Text style={{color:C.muted,fontSize:13,marginBottom:9}}>Quanto foi?</Text><View style={{flexDirection:"row",alignItems:"center",backgroundColor:C.panel,borderRadius:16,borderWidth:1,borderColor:C.line,paddingHorizontal:17,marginBottom:23}}><Text style={{color:C.muted,fontSize:20,fontWeight:"700",marginRight:10}}>R$</Text><TextInput keyboardType="decimal-pad" placeholder="0,00" placeholderTextColor="#687384" value={value} onChangeText={setValue} style={{color:C.text,fontSize:31,fontWeight:"900",paddingVertical:17,flex:1}}/></View>
<Text style={{color:C.text,fontWeight:"800",marginBottom:9}}>O que foi?</Text><TextInput placeholder={type==="despesa"?"Ex.: almoço, mercado, gasolina":"Ex.: salário, venda, renda extra"} placeholderTextColor="#687384" value={desc} onChangeText={setDesc} style={field}/>
<View style={{backgroundColor:C.panel,borderRadius:15,padding:15,marginTop:22,borderWidth:1,borderColor:C.line}}><Text style={{color:C.green,fontWeight:"900"}}>✓ Sem configuração complicada</Text><Text style={{color:C.muted,fontSize:13,lineHeight:20,marginTop:5}}>Sua carteira e a categoria básica são criadas automaticamente no primeiro lançamento.</Text></View>
<Pressable disabled={loading} onPress={save} style={{backgroundColor:C.green,padding:18,borderRadius:15,marginTop:23,opacity:loading?0.65:1}}><Text style={{color:C.bg,textAlign:"center",fontSize:16,fontWeight:"900"}}>{loading?"Salvando...":"Salvar movimentação  ✓"}</Text></Pressable>
</ScrollView></KeyboardAvoidingView>}