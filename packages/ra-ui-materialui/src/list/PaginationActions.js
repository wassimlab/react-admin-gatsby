import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    actions: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: 20,
    },
    hellip: { padding: '1.2em' },
}));

function PaginationActions({
    classes: classesOverride,
    page,
    rowsPerPage,
    count,
    onChangePage,
}) {
    const classes = useStyles({ classes: classesOverride });
    const translate = useTranslate();
    /**
     * Warning: material-ui's page is 0-based
     */
    const range = () => {
        const nbPages = Math.ceil(count / rowsPerPage) || 1;
        if (isNaN(page) || nbPages === 1) {
            return [];
        }
        const input = [];
        // display page links around the current page
        if (page > 1) {
            input.push(1);
        }
        if (page === 3) {
            input.push(2);
        }
        if (page > 3) {
            input.push('.');
        }
        if (page > 0) {
            input.push(page);
        }
        input.push(page + 1);
        if (page < nbPages - 1) {
            input.push(page + 2);
        }
        if (page === nbPages - 4) {
            input.push(nbPages - 1);
        }
        if (page < nbPages - 4) {
            input.push('.');
        }
        if (page < nbPages - 2) {
            input.push(nbPages);
        }

        return input;
    };

    const getNbPages = () => Math.ceil(count / rowsPerPage) || 1;

    const prevPage = event => {
        if (page === 0) {
            throw new Error(translate('ra.navigation.page_out_from_begin'));
        }
        onChangePage(event, page - 1);
    };

    const nextPage = event => {
        if (page > getNbPages() - 1) {
            throw new Error(translate('ra.navigation.page_out_from_end'));
        }
        onChangePage(event, page + 1);
    };

    const gotoPage = event => {
        const page = parseInt(event.currentTarget.dataset.page, 10);
        if (page < 0 || page > getNbPages() - 1) {
            throw new Error(
                translate('ra.navigation.page_out_of_boundaries', {
                    page: page + 1,
                })
            );
        }
        onChangePage(event, page);
    };

    const renderPageNums = () => {
        return range().map((pageNum, index) =>
            pageNum === '.' ? (
                <span key={`hyphen_${index}`} className={classes.hellip}>
                    &hellip;
                </span>
            ) : (
                <Button
                    className="page-number"
                    color={pageNum === page + 1 ? 'default' : 'primary'}
                    key={pageNum}
                    data-page={pageNum - 1}
                    onClick={gotoPage}
                    size="small"
                >
                    {pageNum}
                </Button>
            )
        );
    };

    const nbPages = getNbPages();
    if (nbPages === 1) return <div className={classes.actions} />;
    return (
        <div className={classes.actions}>
            {page > 0 && (
                <Button
                    color="primary"
                    key="prev"
                    onClick={prevPage}
                    className="previous-page"
                    size="small"
                >
                    <ChevronLeft />
                    {translate('ra.navigation.prev')}
                </Button>
            )}
            {renderPageNums()}
            {page !== nbPages - 1 && (
                <Button
                    color="primary"
                    key="next"
                    onClick={nextPage}
                    className="next-page"
                    size="small"
                >
                    {translate('ra.navigation.next')}
                    <ChevronRight />
                </Button>
            )}
        </div>
    );
}

/**
 * PaginationActions propTypes are copied over from material-ui???s
 * TablePaginationActions propTypes. See
 * https://github.com/mui-org/material-ui/blob/869692ecf3812bc4577ed4dde81a9911c5949695/packages/material-ui/src/TablePaginationActions/TablePaginationActions.js#L53-L85
 * for reference.
 */
PaginationActions.propTypes = {
    backIconButtonProps: PropTypes.object,
    count: PropTypes.number.isRequired,
    classes: PropTypes.object,
    nextIconButtonProps: PropTypes.object,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default React.memo(PaginationActions);
