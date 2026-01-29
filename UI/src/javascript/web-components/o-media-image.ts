import Component from './component';

interface CustomProperties {
    iconset: {
        fullscreen: boolean;
        orientation: boolean;
        cc: boolean;
        position: string;
    };
}

export default class OMediaImage extends Component {
    protected properties: CustomProperties = {
        iconset: {
            fullscreen: false,
            orientation: false,
            cc: false,
            position: 'top',
        },
    };

    constructor() {
        super();
    }
}
