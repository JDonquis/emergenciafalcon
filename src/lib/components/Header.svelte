<script>
    $: userNav = false

    function toggleNavUser() {
        userNav = !userNav
        console.log(userNav)
    }

    function clickOutside(element, callbackFunction) {
        console.log('click')
		function onClick(event) {
			if (!element.contains(event.target)) {
				callbackFunction();
			}
		}
		
		document.body.addEventListener('click', onClick);
		
		return {
			update(newCallbackFunction) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		}
	}

</script>
<header
		class="  w-full "
	>

        <nav class="flex justify-between items-center  w-full max-h-32 py-3 gap-3  text-sm px-3 md:px-7 ">
            <span class="flex gap-1 items-center">

            <a href="/dashboard" class="text-2xl hidden md:inline">Dashboard</a>
            </span>
            <div class="flex  bg-gray-100  md:min-w-72 rounded-full items-center">
                <iconify-icon icon="cil:search" class="mx-2" />
                <input
                    type="search"
                    placeholder="Buscar"
                    name=""
                    id=""
                    class=" bg-gray-100 px-3 py-2 rounded-full  w-full"
                />
            </div>
          
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="cursor-pointer flex gap-2 text-right items-center relative" 
            use:clickOutside={() => {
                userNav = false
              }}
            >
                <div class="hidden md:block" on:click={toggleNavUser}>
                    <b>
                        <iconify-icon icon="solar:alt-arrow-down-broken" class="text-xl relative top-1" /> Juan Francisco
                        Villasmil</b
                    >
                    <p>juanvillans@gmail.com</p>
                </div>
                <div
                    class="h-10 aspect-square rounded-full bg-green1 z-20 flex justify-center items-center text-green3"
                    on:click={toggleNavUser} class:blueShadow={userNav}
                >
                    <iconify-icon icon="solar:user-broken" class="text-2xl" class:text-green4={userNav} />
                </div>
                {#if userNav}

                    <div class="absolute rounded-md bg-color4 w-full z-50 px-3 top-14 rounded-tr-none max-h-min ">
                        <!-- <button on:click={authHandlers.logout} class="p-4 flex items-center text-rigth w-full justify-end hover:text-green4 gap-2 hover:font-bold hover:underline" >Cerrar sesión <iconify-icon icon="solar:logout-line-duotone" class="text-xl"></iconify-icon></button> -->
                    </div>
                {/if}
            </div>
    
        </nav>
	</header>