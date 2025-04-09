import ALabelPre from './Label';

 customElements.define('span', ALabelPre);

  const meta: Meta= {
     title: 'Atoms/Labels',
     tags: ['autodocs'],
     parameters: {
         status: { type: 'beta' },
         controls: { sort: 'alpha' },
         docs: { controls: { sort: 'alpha' } },
     },
 };

 type Pre = StoryObj<typeof ALabelPre>;
 export const Default: Pre = {
   args: {
     content: '',
   },
   render: (args) => {
     // Create a new instance of the MScaleUnit class
     const preLabel = new ALabelPre();
     pre.content = args.content;
     return preLabel;
   },
 };