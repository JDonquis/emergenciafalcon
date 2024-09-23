<script>
	import LeftNav from "$lib/components/LeftNav.svelte";
	import Header from "$lib/components/Header.svelte";
	// import { authStore } from '../../stores/authStore';
</script>

<!-- {#if $authStore.currentUser} -->
<section class="bg-white min-h-screen dashboard_container">
	<Header />

	<div class=" main_and_footer_container">

		<main class="p-5">
			<slot />
		</main>


		<footer class="bg-color2 px-5 py-1">fasdfas</footer>

	</div>
    <LeftNav />
	
</section>
<!-- {:else} -->
<!-- <div class="flex items-center justify-center h-screen bg-color1">

	<div class="lds-ripple"><div></div><div></div></div>
</div> -->
<!-- {/if} -->
<style>

</style>
