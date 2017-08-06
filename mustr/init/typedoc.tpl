---

$config:
  outputPath: './typedoc.json'

app: 'App'

---

{
	"name": "{{app}}",
	"mode": "modules",
	"theme": "default",
	"readme": "README.md",
	"media": "./docs_assets",
	"module": "commonjs",
	"ignoreCompilerErrors": "true",
	"experimentalDecorators": "true",
	"emitDecoratorMetadata": "true",
	"target": "ES5",
	"moduleResolution": "node",
	"preserveConstEnums": "true",
	"stripInternal": "true",
	"suppressExcessPropertyErrors": "true",
	"suppressImplicitAnyIndexErrors": "true",
	"jsx": "true"
}