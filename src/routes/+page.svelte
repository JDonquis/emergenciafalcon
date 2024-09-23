<script>
	// import { Auth } from "firebase/auth";
	// import logo from '$lib/images/logo.png';
	import ladyDoctor from '$lib/images/ladyDoctor.png';
	import doctor from '$lib/images/doctor.png';
	import secretariaLogo from '$lib/images/logo_secretaria-circle-main.png';
	import Input from '$lib/components/Input.svelte';
	import Alert from "$lib/components/Alert.svelte";
    import {displayAlert} from "../stores/alertStore"


	let ci = '';
	let password = '';
	let valueSubmit = 'ENTRAR'
	$: console.log(ci, password);

	async function handleSubmit() {

	}
</script>
<Alert />
<main>
	<div class="flex flex-col gap-3 items-center justify-center mb-1 py-6 w-full">
		<img src={secretariaLogo} class="max-w-12 lg:max-w-16" alt="" />
		<h1 class="text-center text-2xl">Emergencia Falcón</h1>
	</div>
	<div class="flex md:justify-center items-center  w-full">
		<img src={doctor} class="hidden md:block md:max-w-96 md:h-96" alt="" />
	
		<div class="text-center w-full">
			
			<form
				method="post"
				action="/"
				class="mx-auto bg-white bg-opacity-5 rounded-lg shadow-2xl p-6 max-w-80  min-w-64 text-center  flex flex-col md:h-96 min-h-96"
			>
				<legend class=" opacity-70 mb-6">INICIAR SESIÓN</legend>
				<div>
					<Input type={'number'} label={'Cédula'} name="ci" bind:value={email} classes={'mb-5'} />
					<!-- <input bind:value={email}> -->
					<Input type={'password'} label={'Contraseña'} name="password" bind:value={password} />
				</div>
				<input
					type="submit"
					value={valueSubmit}
					class="hover:bg-color3 hover:text-white duration-200 mt-auto w-full bg-color2 text-black font-bold py-3 rounded-md cursor-pointer"
				/>
			</form>
		</div>
		<img src={ladyDoctor} class="hidden md:block md:max-w-96 md:h-96" alt="" />

	
	</div>
</main>

<style>
	.home_container {
		background: rgb(172, 215, 242);
		background: linear-gradient(
			306deg,
			rgba(172, 215, 242, 1) 9%,
			rgba(11, 29, 75, 1) 87%,
			rgba(1, 17, 64, 1) 93%
		);
	}
</style>
