/**
 * Created by kagarwal on 8/14/14.
 */
'use strict';

module.exports = function (server) {
    server.get('/:lang', function (req, res) {
        res.cookie('language', req.param('lang'));
        res.redirect('/todos');
    });
};
