export default {
    nodes: [{
        type: 'h2',
        nodes: [{
            type: 'text',
            text: 'Hello'
        }]
    }, {
        type: 'blockquote',
        nodes: [{
            type: 'text',
            text: 'hell'
        }, {
            type: 'text',
            text: 'o w',
            formats: ['bold']
        }, {
            type: 'text',
            text: 'or'
        }, {
            type: 'text',
            text: 'ld',
            formats: ['italic', 'bold']
        }]
    }, {
        type: 'paragraph',
        nodes: [{
            type: 'text',
            text: 'hello world !!!'
        }]
    }, {
        type: 'paragraph',
        nodes: [{
            type: 'text',
            formats: ['bold'],
            text: 'Hello '
        }, {
            type: 'link',
            text: 'World',
            data: { href: '/' },
            meta: { frozen: true }
        }, {
            type: 'text',
            formats: ['italic'],
            text: ' !!!'
        }]
    }, {
        type: 'blockquote',
        nodes: [{
            type: 'block',
            nodes: [{
                type: 'text',
                text: 'block text'
            }]
        }, {
            type: 'blockquote',
            nodes: [{
                type: 'block',
                nodes: [{
                    type: 'text',
                    text: 'sssss'
                }, {
                    type: 'text',
                    text: 'aaaa',
                    formats: ['bold']
                }, {
                    type: 'text',
                    text: 'cccc',
                    formats: ['italic']
                }]
            }, {
                type: 'paragraph',
                nodes: [{
                    type: 'text',
                    text: 'lsellllll'
                }]
            }, {
                type: 'blockquote',
                nodes: [{
                    type: 'text',
                    text: 'hell',
                    formats: ['bold']
                }, {
                    type: 'text',
                    text: 'o w'
                }, {
                    type: 'text',
                    text: 'orld!!!',
                    formats: ['italic']
                }]
            }]
        }]
    }]
};
