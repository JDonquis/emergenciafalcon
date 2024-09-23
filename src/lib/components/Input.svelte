<!-- FloatingInput.svelte -->
<script>
    export let value = '';
    export let label = '';
    export let classes = ''
    export let type = 'text';
  </script>
 
  <div class="relative {classes}">
    <input {...{ type }} id="{label}" class="bg-color1 block px-2.5 pb-2.5 pt-4 w-full text-sm   rounded-lg  appearance-none dark:text-white  focus:outline-none focus:ring-0  peer " placeholder=" " bind:value  />
    <label for="{label}" class="absolute text-sm   duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] rounded-xl px-2 peer-focus:px-2 text-white peer-focus:text-color2 peer-focus:dark:text-color2  peer-placeholder-shown:text-color2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 ">{label}</label>
</div>
