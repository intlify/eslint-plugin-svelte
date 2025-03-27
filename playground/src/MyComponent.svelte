
<script>
  import { t } from 'svelte-i18n'
</script>
<!-- ✗ BAD -->
<p>hello</p>

<!-- ✓ GOOD -->
<p>{ $t('hello') }</p>
